import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const appDir = path.resolve(__dirname, '../src/app');
const outputPath = path.resolve(__dirname, '../config/navigation.yml');
const authPath = path.resolve(__dirname, '../config/auth.yml');
const CONTAINER_NAME = process.env.CONTAINER_NAME ?? "localhost";
const PORT = process.env.PORT ?? 3000;

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

function extractPageNameFromMeta(filePath: string): {
  name: string,
  pageName: string,
  auth: {
    role: string[]
    iframe_only?: boolean
  }
} | undefined {
  const metaPath = filePath.replace(/page\.(tsx|jsx)$/, 'page.meta.yml');
  if (fs.existsSync(metaPath)) {
    try {
      const content = fs.readFileSync(metaPath, 'utf-8');
      const data = yaml.load(content);
      if (typeof data === 'object' && data && 'name' in data) {
        let pageName = ""
        if("page_name" in data)
          pageName = (data as any).page_name
        else
          pageName = getRouteFromPath(filePath).slice(1)
        return {
          name:(data as any).name,
          pageName: pageName,
          auth: (data as any).auth,
        };
      }
    } catch (err) {
      console.warn(`⚠️ Ошибка чтения ${metaPath}:`, err);
    }
  }
  return undefined;
}

function main() {
  const pages = scanDir(appDir);
  const nav = []
  const auth = []


  for(const filePath of pages){
    const relativePath = filePath.replace(appDir + '/', '');
    const route = getRouteFromPath(filePath);
    let meta = extractPageNameFromMeta(filePath);
    if(meta === undefined){
      meta = {
        name: 'Без названия',
        pageName: route.slice(1),
        auth: {
          role: ["admin"],
          iframe_only: false
        }
      }
    }
    nav.push({
      path: route,
      file: relativePath,
      host: `${CONTAINER_NAME}:${PORT}`,
      full_path: `${CONTAINER_NAME}:${PORT}${route}`,
      type: 'website',
      name: meta.name,
      service: CONTAINER_NAME,
      page_name: meta.pageName
    });
    if(meta.auth.iframe_only === undefined)
      meta.auth.iframe_only = false
    auth.push({
      ...meta.auth,
      service: CONTAINER_NAME,
      path: route,
      full_path: `${CONTAINER_NAME}:${PORT}${route}`
    })
  }

  const yamlStr = yaml.dump(nav, { lineWidth: 1000 });
  fs.writeFileSync(outputPath, yamlStr, 'utf-8');
  console.log(`✅ Page description written to: ${outputPath}`);

  const authData = {
    service: CONTAINER_NAME,
    pages: auth
  }

  const yamlAuthStr = yaml.dump(authData, { lineWidth: 1000 });
  fs.writeFileSync(authPath, yamlAuthStr, 'utf-8');
  console.log(`✅ Page description written to: ${authPath}`);
}

main();
