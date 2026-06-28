import { existsSync } from 'node:fs';
import { readdir, readFile, stat } from 'node:fs/promises';
import { dirname, join, normalize, resolve, sep } from 'node:path';

const outputDirectory = resolve('_site');
const attributePattern = /\b(?:href|src)="([^"]+)"/g;
const ignoredProtocols = /^(?:https?:|mailto:|tel:|data:|javascript:)/i;

const walkHtmlFiles = async directory => {
  const entries = await readdir(directory);
  const files = [];

  for (const entry of entries) {
    const fullPath = join(directory, entry);
    const entryStat = await stat(fullPath);

    if (entryStat.isDirectory()) {
      files.push(...await walkHtmlFiles(fullPath));
      continue;
    }

    if (entry.endsWith('.html')) {
      files.push(fullPath);
    }
  }

  return files;
};

const stripUrlSuffix = value => value.split('#')[0].split('?')[0];

const resolveInternalTarget = (htmlFile, rawReference) => {
  const reference = stripUrlSuffix(rawReference.trim());

  if (!reference || reference.startsWith('#') || ignoredProtocols.test(reference)) {
    return null;
  }

  if (reference.startsWith('/')) {
    return resolve(outputDirectory, `.${reference}`);
  }

  return resolve(dirname(htmlFile), reference);
};

const assertInsideOutputDirectory = target => {
  const relativePath = normalize(target).replace(normalize(outputDirectory), '');

  return relativePath === '' || relativePath.startsWith(sep);
};

const htmlFiles = await walkHtmlFiles(outputDirectory);
const missingReferences = [];

for (const htmlFile of htmlFiles) {
  const html = await readFile(htmlFile, 'utf8');
  const matches = html.matchAll(attributePattern);

  for (const match of matches) {
    const rawReference = match[1];
    const target = resolveInternalTarget(htmlFile, rawReference);

    if (!target) {
      continue;
    }

    if (!assertInsideOutputDirectory(target) || !existsSync(target)) {
      missingReferences.push(`${htmlFile}: ${rawReference}`);
    }
  }
}

if (missingReferences.length > 0) {
  console.error('Liens internes introuvables :');
  missingReferences.forEach(reference => console.error(`- ${reference}`));
  process.exit(1);
}

console.log(`${htmlFiles.length} pages HTML vérifiées, aucun lien interne cassé.`);
