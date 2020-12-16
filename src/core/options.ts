/*
 * @Author: saber2pr
 * @Date: 2020-05-05 21:05:01
 * @Last Modified by: saber2pr
 * @Last Modified time: 2020-05-05 21:10:05
 */
import { monaco } from './monaco'

export const commonOptions = {
  tabSize: 2,
}

export const tsxCompilerOptions = {
  jsx: monaco.languages.typescript.JsxEmit['React'],
  target: monaco.languages.typescript.ScriptTarget['ES5'],
  module: monaco.languages.typescript.ModuleKind['AMD'],
  allowSyntheticDefaultImports: true,
  esModuleInterop: true,
  allowJs: true,
  experimentalDecorators: true,
  emitDecoratorMetadata: true,
  downlevelIteration: true,
  removeComments: true,
  lib: ['dom', 'dom.iterable', 'esnext'],
}
