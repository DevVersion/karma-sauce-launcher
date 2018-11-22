#!/bin/bash

# Go to project directory.
cd $(dirname ${0})/

# Fail if any individual command failed.
set -e

# Clean dist dir.
rm -rf dist/

# Compile TypeScript
$(yarn bin)/tsc -p src/

echo "Successfully built the release output"
