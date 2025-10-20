#!/usr/bin/env bash
set -e

for pkg in $(grep -A2 "path = \"external/whl_all/" pyproject.toml | grep "^\w" | cut -d' ' -f1 | tr -d '=')
do
    echo "🗑 poetry remove $pkg"
    poetry remove "$pkg"
done
