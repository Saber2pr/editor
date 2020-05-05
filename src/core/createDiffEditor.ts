/*
 * @Author: saber2pr
 * @Date: 2020-05-05 20:49:01
 * @Last Modified by: saber2pr
 * @Last Modified time: 2020-05-05 21:03:26
 */
import { commonOptions } from "./options"
import { monaco } from "./monaco"

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
