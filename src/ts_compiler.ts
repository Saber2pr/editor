/*
 * @Author: saber2pr
 * @Date: 2020-04-14 15:58:16
 * @Last Modified by: saber2pr
 * @Last Modified time: 2020-04-14 16:19:09
 */
declare const ts

export const checkTSSupport = () => {
  if (window["ts"] === undefined) {
    alert("Error: no support for typescript.")
  }
}

export const transpileModule = (
  input,
  options = {
    module: ts.ModuleKind.None,
    target: ts.ScriptTarget.ES5,
    noLib: true,
    noResolve: true,
    suppressOutputPathCheck: true,
    jsx: null
  }
) =>
  new Promise(resolve => {
    const inputFileName = options.jsx ? "module.tsx" : "module.ts"
    const sourceFile = ts.createSourceFile(
      inputFileName,
      input,
      options.target || ts.ScriptTarget.ES5
    )
    const program = ts.createProgram([inputFileName], options, {
      getSourceFile: fileName =>
        fileName.indexOf("module") === 0 ? sourceFile : undefined,
      writeFile: (_name, text) => resolve(text),
      getDefaultLibFileName: () => "lib.d.ts",
      useCaseSensitiveFileNames: () => false,
      getCanonicalFileName: fileName => fileName,
      getCurrentDirectory: () => "",
      getNewLine: () => "\r\n",
      fileExists: fileName => fileName === inputFileName,
      readFile: () => "",
      directoryExists: () => true,
      getDirectories: () => []
    })
    program.emit()
  })
