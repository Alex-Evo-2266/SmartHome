#!/bin/bash

APP_NAME=$1

if [ -z "$APP_NAME" ]; then
  echo "Использование: ./create-next.sh <app-name>"
  exit 1
fi

# создаём приложение
npx create-next-app@latest $APP_NAME --typescript --eslint --app

SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &> /dev/null && pwd)
BASE_DIR=$PWD

mkdir -p $BASE_DIR/$APP_NAME/scripts

cp "$SCRIPT_DIR/src/create_config_files.ts" "$BASE_DIR/$APP_NAME/scripts/"
cp "$SCRIPT_DIR/src/tsconfig.scripts.json" "$BASE_DIR/$APP_NAME/"
cp "$SCRIPT_DIR/src/next.config.ts" "$BASE_DIR/$APP_NAME/"

cd $APP_NAME

echo "Next.js приложение $APP_NAME создано!"

npm install js-yaml
npm install

tmpfile=$(mktemp)
jq '.scripts["build"]="next build && tsc -p tsconfig.scripts.json" | .scripts["generate:pages"]="node dist/create_config_files.js"' package.json > "$tmpfile" && mv "$tmpfile" package.json

tmpfile=$(mktemp)
jq '.compilerOptions["outDir"]="dist"' tsconfig.json > "$tmpfile" && mv "$tmpfile" tsconfig.json

rm -rf $BASE_DIR/$APP_NAME/src/app
rm -rf $BASE_DIR/$APP_NAME/public