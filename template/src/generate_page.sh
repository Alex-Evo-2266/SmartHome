#!/bin/bash

PAGE_NAME=$1

if [ -z "$PAGE_NAME" ]; then
  echo "Использование: ./generate_page.sh <page-name>"
  exit 1
fi

# Базовая директория с app router (можешь поменять под свой проект)
BASE_DIR="$(dirname "$(realpath "$0")")/../src/app"
PAGE_DIR="$BASE_DIR/$PAGE_NAME"

COMPONENT_NAME=$(echo "$PAGE_NAME" | sed -E 's/(^|_)([a-z])/\U\2/g')

# Создать папку для страницы
mkdir -p "$PAGE_DIR"

# Создать page.tsx
cat > "$PAGE_DIR/page.tsx" <<EOF
'use client';

export default function ${COMPONENT_NAME}() {
  return (
    <div>
      <h2>${COMPONENT_NAME}</h2>
    </div>
  );
}
EOF

# Создать page.meta.yml
cat > "$PAGE_DIR/page.meta.yml" <<EOF
name: ${PAGE_NAME}
page_name: ${PAGE_NAME}
auth:
  roles:
    - admin
EOF

echo "✅ Страница $PAGE_NAME сгенерирована в $PAGE_DIR"
