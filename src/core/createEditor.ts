import { monaco } from './monaco'
/*
 * @Author: saber2pr
 * @Date: 2020-04-10 15:05:30
 * @Last Modified by: saber2pr
 * @Last Modified time: 2020-05-05 21:22:53
 */
import { commonOptions } from './options'
import { createTSXModel } from './typescript'

interface DefaultValues {
  [type: string]: string
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

  const setSize = (width: number, height: number) =>
    editor.layout({ width, height })
  const getSize = () => editor.getLayoutInfo()

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

  return {
    setValue,
    getValue,
    getInstance,
    changeModel,
    getData,
    setSize,
    getSize,
    getModel,
    getState,
    setState
  }
}

export type EditorAPI = ReturnType<typeof createEditor>
