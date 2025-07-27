// import fs from 'fs';
// import path from 'path';

// const appDir = path.resolve(__dirname, '../src/app');
// const outputPath = path.resolve(__dirname, '../config/pages-description.json');
// const CONTAINER_NAME = process.env.CONTAINER_NAME ?? "localhost"
// const PORT = process.env.PORT ?? 3000

// function isPageFile(fileName: string) {
//   return fileName === 'page.tsx' || fileName === 'page.jsx';
// }

// function getRouteFromPath(filePath: string) {
//   return filePath
//     .replace(appDir, '')
//     .replace(/\/page\.(tsx|jsx)$/, '')
//     .replace(/\[(.*?)\]/g, ':$1') || '/';
// }

// function scanDir(dir: string): string[] {
//   const entries = fs.readdirSync(dir, { withFileTypes: true });

//   return entries.flatMap((entry) => {
//     const fullPath = path.join(dir, entry.name);

//     if (entry.isDirectory()) {
//       return scanDir(fullPath);
//     } else if (isPageFile(entry.name)) {
//       return [fullPath];
//     }
//     return [];
//   });
// }

// function main() {
//   const pages = scanDir(appDir);
//   const result = pages.map((filePath) => ({
//     path: getRouteFromPath(filePath),
//     file: filePath.replace(appDir + '/', ''),
//     host: `${CONTAINER_NAME}:${PORT}`,
//     full_path: `${CONTAINER_NAME}:${PORT}${getRouteFromPath(filePath)}`
//   }));

//   fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), 'utf-8');
//   console.log(`✅ Page description written to: ${outputPath}`);
// }

// main();


import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const appDir = path.resolve(__dirname, '../src/app');
const outputPath = path.resolve(__dirname, '../config/navigation.yml');

const CONTAINER_NAME = process.env.CONTAINER_NAME ?? "localhost";
const PORT = process.env.PORT ?? 3000;
console.log(CONTAINER_NAME, PORT)

function isPageFile(fileName: string) {
  return fileName === 'page.tsx' || fileName === 'page.jsx';
}

function getRouteFromPath(filePath: string) {
  return (
    filePath
      .replace(appDir, '')
      .replace(/\/page\.(tsx|jsx)$/, '')
      .replace(/\[(.*?)\]/g, ':$1') || '/'
  );
}

function scanDir(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  return entries.flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      return scanDir(fullPath);
    } else if (isPageFile(entry.name)) {
      return [fullPath];
    }
    return [];
  });
}

function main() {
  const pages = scanDir(appDir);
  const result = pages.map((filePath) => ({
    path: getRouteFromPath(filePath),
    file: filePath.replace(appDir + '/', ''),
    host: `${CONTAINER_NAME}:${PORT}`,
    full_path: `${CONTAINER_NAME}:${PORT}${getRouteFromPath(filePath)}`,
    type: "website"
  }));

  const yamlStr = yaml.dump(result, { lineWidth: 1000 });
  fs.writeFileSync(outputPath, yamlStr, 'utf-8');

  console.log(`✅ Page description written to: ${outputPath}`);
}

main();
