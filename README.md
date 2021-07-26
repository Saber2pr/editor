# tsx-editor

🌊 a web editor for react/tsx app develop、build !

Write TypeScript code in the browser, React (TSX) code! Support for compiling and exporting!

https://editor-saber2pr.vercel.app/

English | [简体中文](https://github.com/Saber2pr/editor/blob/master/README-zh_CN.md)

# Start

[![loading...](https://fronted-tsx-developer.github.io/samples/other/tsx-editor.webp)](https://fronted-tsx-developer.github.io/tsx-editor-online/)

# Dev

```bash
yarn install

yarn dev
```

# Update

If I haven't maintained it for a long time and the TypeScript version is too old, do the following:

```bash
git clone https://github.com/Saber2pr/editor.git

cd editor

yarn install

# update typescript version
yarn add monaco-editor
yarn add monaco-editor-webpack-plugin -D

yarn build

cp -r samples build/samples

cd build

npx serve
```
