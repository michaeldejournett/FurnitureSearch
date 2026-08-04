import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const siteRoot = path.resolve(process.argv[2] ?? '_site');
const allowedTopLevelEntries = new Set([
  '.nojekyll',
  'assets',
  'css',
  'data',
  'index.html',
  'js',
]);
const requiredTopLevelEntries = [...allowedTopLevelEntries];
const failures = [];
const checkedFiles = new Set();

function isWithinSite(targetPath) {
  return targetPath === siteRoot || targetPath.startsWith(`${siteRoot}${path.sep}`);
}

function isExternalOrEmpty(reference) {
  return (
    !reference ||
    reference.startsWith('#') ||
    reference.startsWith('//') ||
    /^[a-z][a-z\d+.-]*:/i.test(reference)
  );
}

async function validateReference(reference, baseDirectory, source) {
  const trimmedReference = reference.trim().replaceAll('&amp;', '&');
  if (isExternalOrEmpty(trimmedReference)) return;

  const pathOnly = trimmedReference.split(/[?#]/, 1)[0];
  let decodedPath;

  try {
    decodedPath = decodeURIComponent(pathOnly);
  } catch {
    failures.push(`${source}: invalid URL encoding in "${trimmedReference}"`);
    return;
  }

  const targetPath = path.resolve(
    decodedPath.startsWith('/') ? siteRoot : baseDirectory,
    decodedPath.replace(/^\/+/, ''),
  );

  if (!isWithinSite(targetPath)) {
    failures.push(`${source}: reference escapes the deployed site: "${trimmedReference}"`);
    return;
  }

  try {
    await access(targetPath);
    checkedFiles.add(path.relative(siteRoot, targetPath));
  } catch {
    failures.push(
      `${source}: missing "${trimmedReference}" (${path.relative(siteRoot, targetPath)})`,
    );
  }
}

async function walkFiles(directory, extension) {
  const matches = [];

  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      matches.push(...(await walkFiles(entryPath, extension)));
    } else if (entry.isFile() && entry.name.endsWith(extension)) {
      matches.push(entryPath);
    }
  }

  return matches;
}

function parseCsv(csv) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;

  for (let index = 0; index < csv.length; index += 1) {
    const character = csv[index];

    if (inQuotes) {
      if (character === '"' && csv[index + 1] === '"') {
        field += '"';
        index += 1;
      } else if (character === '"') {
        inQuotes = false;
      } else {
        field += character;
      }
    } else if (character === '"') {
      inQuotes = true;
    } else if (character === ',') {
      row.push(field);
      field = '';
    } else if (character === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else if (character !== '\r') {
      field += character;
    }
  }

  if (field || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows;
}

async function validateDeployScope() {
  const entries = await readdir(siteRoot);

  for (const entry of entries) {
    if (!allowedTopLevelEntries.has(entry)) {
      failures.push(`deployment contains unexpected top-level entry: "${entry}"`);
    }
  }

  for (const entry of requiredTopLevelEntries) {
    try {
      await access(path.join(siteRoot, entry));
    } catch {
      failures.push(`deployment is missing required top-level entry: "${entry}"`);
    }
  }
}

async function validateHtml() {
  const indexPath = path.join(siteRoot, 'index.html');
  const html = await readFile(indexPath, 'utf8');
  const attributePattern = /\b(?:href|src)\s*=\s*(["'])(.*?)\1/giu;

  for (const match of html.matchAll(attributePattern)) {
    await validateReference(match[2], siteRoot, 'index.html');
  }
}

async function validateCss() {
  const cssDirectory = path.join(siteRoot, 'css');
  const cssFiles = await walkFiles(cssDirectory, '.css');
  const urlPattern = /url\(\s*(["']?)(.*?)\1\s*\)/giu;

  for (const cssPath of cssFiles) {
    const css = await readFile(cssPath, 'utf8');
    const source = path.relative(siteRoot, cssPath);

    for (const match of css.matchAll(urlPattern)) {
      await validateReference(match[2], path.dirname(cssPath), source);
    }
  }
}

async function validateJavaScript() {
  const jsDirectory = path.join(siteRoot, 'js');
  const jsFiles = await walkFiles(jsDirectory, '.js');
  const documentRelativePatterns = [
    /\bfetch\(\s*(["'])(.*?)\1/giu,
    /\bDEFAULT_BG\s*=\s*(["'])(.*?)\1/giu,
  ];

  for (const jsPath of jsFiles) {
    const javascript = await readFile(jsPath, 'utf8');
    const source = path.relative(siteRoot, jsPath);

    for (const pattern of documentRelativePatterns) {
      for (const match of javascript.matchAll(pattern)) {
        await validateReference(match[2], siteRoot, source);
      }
    }
  }
}

async function validateFurnitureImages() {
  const csvPath = path.join(siteRoot, 'data', 'furniture_proposals.csv');
  const rows = parseCsv(await readFile(csvPath, 'utf8'));
  const imageColumn = rows[0]?.indexOf('ImageURL') ?? -1;

  if (imageColumn === -1) {
    failures.push('data/furniture_proposals.csv: missing ImageURL column');
    return;
  }

  for (let index = 1; index < rows.length; index += 1) {
    const imageReference = rows[index][imageColumn]?.trim();
    if (isExternalOrEmpty(imageReference)) continue;

    const deployedReference = imageReference.startsWith('images/')
      ? `assets/${imageReference}`
      : imageReference;
    await validateReference(
      deployedReference,
      siteRoot,
      `data/furniture_proposals.csv row ${index + 1}`,
    );
  }
}

await validateDeployScope();
await validateHtml();
await validateCss();
await validateJavaScript();
await validateFurnitureImages();

if (failures.length > 0) {
  console.error(`Site validation failed with ${failures.length} error(s):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log(
    `Validated the deployment scope and ${checkedFiles.size} unique local reference(s) in ${siteRoot}.`,
  );
}
