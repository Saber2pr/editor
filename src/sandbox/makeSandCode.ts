/*
 * @Author: saber2pr
 * @Date: 2020-04-24 13:35:03
 * @Last Modified by: saber2pr
 * @Last Modified time: 2020-05-05 20:53:56
 */
import { KEYS } from '../constants'
import { compileTS, EditorAPI } from '../core'
import { enClosure } from '../utils'
import { ConsoleHook } from './hooks'

export const makeSandCode = async (
  editor: EditorAPI,
  mode: "dev" | "pro" = "dev"
) => {
  const js = editor.getValue("javascript")
  const html = editor.getValue("html")
  const css = editor.getValue("css")
  const typescript = editor.getValue("typescript")
  const json = editor.getValue("json")

  // cache
  localStorage.setItem(KEYS.__LS_JS__, js)
  localStorage.setItem(KEYS.__LS_HTML__, html)
  localStorage.setItem(KEYS.__LS_CSS__, css)
  localStorage.setItem(KEYS.__LS_TS__, typescript)
  localStorage.setItem(KEYS.__LS_JSON__, json)

  let code = `${mode === "dev" ? ConsoleHook : ""}
		 ${css && `<style>${css}</style>`}
		 ${json && `<script>var ${KEYS.__VAR_JSON__} = ${json};</script>`}
		 ${html}
		 ${js && `<script>${enClosure(js)}</script>`}`

  if (!!typescript) {
    let ts_js = await compileTS(editor.getModel("typescript").uri)
    if (ts_js.includes("define")) {
      ts_js = ts_js.replace(/define\(/, 'define("index",')
      code += `<script>${ts_js};require(["index"])</script>`
    } else {
      code += `<script>${enClosure(ts_js)}</script>`
    }
  }

  const parser = new DOMParser()
  const doc = parser.parseFromString(code, "text/html")
  return `<!DOCTYPE html><html>${doc.children[0].innerHTML}</html>`
}
