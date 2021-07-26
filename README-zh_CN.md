# tsx-editor

🌊 a web editor for react/tsx app develop、build !

在浏览器中编写 typescript 代码，react(tsx)代码！支持编译导出！

https://saber2pr.top/editor/

[English](https://github.com/Saber2pr/editor/blob/master/README.md) | 简体中文

# Start

[![loading...](https://fronted-tsx-developer.github.io/samples/other/tsx-editor.webp)](https://fronted-tsx-developer.github.io/tsx-editor-online/)

# Dev

```bash
yarn install

yarn dev
```

# Update

如果我长时间没有维护，导致 typescript 版本过老，按以下办法执行升级：

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
