/*
 * @Author: saber2pr
 * @Date: 2020-04-24 13:35:03
 * @Last Modified by: saber2pr
 * @Last Modified time: 2020-04-24 14:54:57
 */
import { __LS_JS__, __LS_HTML__, __LS_CSS__, __LS_TS__ } from "./constants"
import { compileTS } from "./createEditor"

const hook_console = `<script data-type="console-hook">
;(() => {
	// hook
	var origin_log = console.log
	console.log = function() {
		origin_log.apply(this, arguments)
		var output = Array.from(arguments).join(" ")
		top.postMessage({method: "console", value: output}, top.location.origin)
	}
	window.addEventListener('error', event => {
		top.postMessage({method: "console-error", value: event.message}, top.location.origin)
	})
})()</script>`

const AMDSupport = `<script src="https://cdn.bootcss.com/require.js/2.3.6/require.min.js"></script>
<script>
	var unpkgPath = modName =>
		"https://unpkg.com/"+modName+"/umd/"+modName+".production.min.js"
	var oldLoad = requirejs.load
	requirejs.load = function(context, id, url) {
		if (["react", "react-dom"].indexOf(id) != -1) {
			url = unpkgPath(id)
		}
		return oldLoad.call(requirejs, context, id, url)
	}
</script>`

const enClosure = (code: string) => `;(function(){
${code}
})();`

export const makeSandCode = async editor => {
  const js = editor.getValue("javascript")
  const html = editor.getValue("html")
  const css = editor.getValue("css")
  const typescript = editor.getValue("typescript")

  // cache
  localStorage.setItem(__LS_JS__, js)
  localStorage.setItem(__LS_HTML__, html)
  localStorage.setItem(__LS_CSS__, css)
  localStorage.setItem(__LS_TS__, typescript)

  let code =
    hook_console +
    `<style>${css}</style>${html}<script>${enClosure(js)}</script>`
  if (!!typescript) {
    let ts_js = await compileTS(editor.getModel("typescript").uri)
    if (ts_js.includes("define")) {
      ts_js = ts_js.replace(/define\(/, 'define("index",')
      code = AMDSupport + code + `<script>${ts_js};require(["index"])</script>`
    } else {
      code += `<script>${enClosure(ts_js)}</script>`
    }
  }

  return code
}
