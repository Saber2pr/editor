# Open API:

### 1. api_compileTS

get js emitted from ts-compiler.

```ts
function api_compileTS(): Promise<string>
```

for example:

```js
window["api_compileTS"]().then(console.log)
```

### 2. api_addModuleDeclaration

add d.ts file.

```ts
function api_addModuleDeclaration(url: string, moduleName: string): Promise<any>
```

### 3. api_editor

```ts
const api_editor: IStandaloneCodeEditor
```

[IStandaloneCodeEditor](https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.istandalonecodeeditor.html)

### 4. api_diffEditor

```ts
const api_diffEditor: IStandaloneCodeEditor
```

[IStandaloneCodeEditor](https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.istandalonecodeeditor.html)

### 5. api_getSandBoxEmit

get html output string from sandbox.

```ts
function api_getSandBoxEmit(): string
```