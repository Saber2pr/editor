/*
 * @Author: saber2pr
 * @Date: 2020-04-24 13:35:03
 * @Last Modified by: saber2pr
 * @Last Modified time: 2020-04-30 14:48:36
 */
import {
  __LS_JS__,
  __LS_HTML__,
  __LS_CSS__,
  __LS_TS__,
  __LS_JSON__,
  __VAR_JSON__,
  __SANDBOX_HOOK__,
  __MESSAGE_CONSOLE__,
  __MESSAGE_CONSOLE_ERROR__
} from "./constants"
import { compileTS } from "./createEditor"
import { enClosure } from "./utils"
import { ConsoleHook } from "./hooks"

export const makeSandCode = async editor => {
  const js = editor.getValue("javascript")
  const html = editor.getValue("html")
  const css = editor.getValue("css")
  const typescript = editor.getValue("typescript")
  const json = editor.getValue("json")

  // cache
  localStorage.setItem(__LS_JS__, js)
  localStorage.setItem(__LS_HTML__, html)
  localStorage.setItem(__LS_CSS__, css)
  localStorage.setItem(__LS_TS__, typescript)
  localStorage.setItem(__LS_JSON__, json)

  let code =
    ConsoleHook +
    `${css && `<style>${css}</style>`}
		 ${json && `<script>var ${__VAR_JSON__} = ${json};</script>`}
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

  return code
}
