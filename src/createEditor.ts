/*
 * @Author: saber2pr
 * @Date: 2020-04-10 15:05:30
 * @Last Modified by: saber2pr
 * @Last Modified time: 2020-04-22 22:24:02
 */
import * as monaco from "monaco-editor/esm/vs/editor/editor.main.js"
import { getReferencePaths, resolvePath } from "./utils"

interface DefaultValues {
  [type: string]: string
}

const commonOptions = {
  tabSize: 2
}

export function createEditor(
  editorContainer: HTMLElement,
  defaultValues: DefaultValues
) {
  const data = Object.fromEntries(
    Object.entries(defaultValues).map(([type, value]) => {
      const model =
        type === "typescript"
          ? createTSXModel(value)
          : monaco.editor.createModel(value, type)
      model.updateOptions(commonOptions)
      return [type, { state: null, model }]
    })
  )
  const defaultLang = Object.keys(defaultValues)[0]
  const editor = monaco.editor.create(editorContainer, {
    model: data[defaultLang].model,
    wordWrap: "on"
  })
  function setValue(value: string): void
  function setValue(type: string, value: string): void
  function setValue(type: string, value?: string) {
    if (value === undefined) {
      editor.setValue(type)
    } else {
      if (type in data) {
        data[type].model.setValue(value)
      } else {
        throw new Error(`type ${type} is not found in data.`)
      }
    }
  }
  function getCurrentValue() {
    return editor.getValue()
  }
  function getValue(type?: string) {
    if (type === undefined) {
      return editor.getValue()
    } else {
      if (type in data) {
        return data[type].model.getValue()
      } else {
        throw new Error(`type ${type} is not found in data.`)
      }
    }
  }
  function getState(type: string) {
    if (type in data) {
      return data[type].state
    } else {
      throw new Error(`type ${type} is not found in data.`)
    }
  }
  function setState(type: string, state) {
    if (type in data) {
      data[type].state = state
    } else {
      throw new Error(`type ${type} is not found in data.`)
    }
  }
  function getData() {
    return data
  }
  function getInstance() {
    return editor
  }
  function setSize(width: number, height: number) {
    editor.layout({ width, height })
  }
  function getSize() {
    const { width, height } = editor.getLayoutInfo()
    return { width, height }
  }
  function getModel(type?: string) {
    if (type === undefined) {
      return editor.getModel()
    } else {
      if (type in data) {
        return data[type].model
      } else {
        throw new Error(`type ${type} is not found in data.`)
      }
    }
  }
  function changeModel(type: string) {
    if (type in data) {
      const currentState = editor.saveViewState()
      const currentModel = editor.getModel()
      for (const type in data) {
        const lastLayout = data[type]
        if (currentModel === lastLayout.model) {
          lastLayout.state = currentState
        }
      }
      editor.setModel(data[type].model)
      editor.restoreViewState(data[type].state)
      editor.focus()
    } else {
      throw new Error(`type ${type} is not found in data.`)
    }
  }
  function setTheme(type: "vs" | "vs-dark" | "hc-black") {
    editor._themeService.setTheme(type)
  }
  return {
    setValue,
    getValue,
    getCurrentValue,
    getInstance,
    changeModel,
    getData,
    setTheme,
    setSize,
    getSize,
    getModel,
    getState,
    setState
  }
}

export type EditorAPI = ReturnType<typeof createEditor>

export const createDiffEditor = (
  container: HTMLElement,
  original: string,
  modified: string
) => {
  const originalModel = monaco.editor.createModel(original, "text/plain")
  const modifiedModel = monaco.editor.createModel(modified, "text/plain")

  originalModel.updateOptions(commonOptions)
  modifiedModel.updateOptions(commonOptions)

  const diffEditor = monaco.editor.createDiffEditor(container)
  diffEditor.setModel({
    original: originalModel,
    modified: modifiedModel
  })

  function setSize(width: number, height: number) {
    diffEditor.layout({ width, height })
  }

  return {
    instance: diffEditor,
    setSize,
    originalModel,
    modifiedModel
  }
}

export type DiffEditorAPI = ReturnType<typeof createDiffEditor>

export const compileTS = async uri => {
  const tsWorker = await monaco.languages.typescript.getTypeScriptWorker()
  const client = await tsWorker(uri)
  const result = await client.getEmitOutput(uri.toString())
  const files = result.outputFiles[0]
  return files.text
}

export const createTSXModel = (content: string) => {
  const CompilerOptions = monaco.languages.typescript.typescriptDefaults.getCompilerOptions()
  monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
    ...CompilerOptions,
    jsx: monaco.languages.typescript.JsxEmit["React"],
    target: monaco.languages.typescript.ScriptTarget["ES5"],
    module: monaco.languages.typescript.ModuleKind["AMD"],
    allowSyntheticDefaultImports: true,
    esModuleInterop: true,
    allowJs: true,
    experimentalDecorators: true,
    emitDecoratorMetadata: true,
    downlevelIteration: true,
    removeComments: true
  })
  return monaco.editor.createModel(
    content,
    "typescript",
    monaco.Uri.file("input.tsx")
  )
}

const ExtraLibs = {}
export const addModuleDeclaration = async (url: string, moduleName: string) => {
  if (moduleName in ExtraLibs) {
    return ExtraLibs[moduleName]
  }

  const text = await fetch(url).then(res => res.text())

  const paths = getReferencePaths(text)
  await Promise.all(
    paths.map(path => {
      const referPath = resolvePath(url, path)
      return addModuleDeclaration(referPath, path)
    })
  )

  const wrapped = `declare module "${moduleName}" { ${text} }`
  const lib = monaco.languages.typescript.typescriptDefaults.addExtraLib(
    wrapped,
    moduleName
  )
  ExtraLibs[moduleName] = lib
}
// export api for scripts.
window["api_addModuleDeclaration"] = addModuleDeclaration
