# tsx-editor

在浏览器中编写 typescript 代码，react(tsx)代码！支持编译导出！

> a web editor for tsx page writing.

国内加速(推荐)：https://saber2pr.gitee.io/editor-online/

link: https://fronted-tsx-developer.github.io/tsx-editor-online/

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
