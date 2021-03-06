install:
	npm install

start:
	npm run babel-node -- src/bin/gendiff.js

publish:
	npm publish --dry-run

lint:
	npx eslint .

build:
	rm -rf dist
	npm run build

test:
	npm test

.PHONY: test