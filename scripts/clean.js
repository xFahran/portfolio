import { rm } from 'node:fs/promises';
import { resolve } from 'node:path';

const outputDirectory = resolve('_site');

await rm(outputDirectory, { force: true, recursive: true });
