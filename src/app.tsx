/*
 * @Author: saber2pr
 * @Date: 2020-04-22 22:36:26
 * @Last Modified by: saber2pr
 * @Last Modified time: 2020-04-24 15:31:35
 */
declare const LOADING: { init(): void; destroy(): void }

import TSX, { useRef, useEffect, render } from "@saber2pr/tsx"
import {
  createEditor,
  EditorAPI,
  DiffEditorAPI,
  createDiffEditor,
  addModuleDeclaration,
  compileTS
} from "./createEditor"
import "./app.css"
import {
  __LS_JS__,
  __LS_TS__,
  __LS_CSS__,
  __LS_HTML__,
  __LS_EDITOR_THEME__,
  __LS_EDITOR_WIDTH__,
  __VERSION__,
  __LS_BG__,
  __LS_BG_OP__,
  __LS_ARG__
} from "./constants"
import { openModel } from "./components/model/model"
import { Settings, ModuleManager } from "./components/settings/settings"
import { debounce, addDragListener, addUploadListener } from "./utils"
import { loadSamples } from "./samples"
import { makeSandCode } from "./makeSandCode"
import { getSandBoxEmit } from "./getSandBoxEmit"

const FILES = {
  current: "typescript",
  javascript: "main.js",
  typescript: "main.tsx",
  css: "style.css",
  html: "index.html"
}

const addDefaultDeclarations = async () => {
  await addModuleDeclaration("/libs/react/index.d.ts", "react")
  await addModuleDeclaration("/libs/react-dom/index.d.ts", "react-dom")
  await addModuleDeclaration("/libs/csstype/index.d.ts", "csstype")
  await addModuleDeclaration("/libs/prop-types/index.d.ts", "prop-types")
}

const App = () => {
  let editor: EditorAPI
  let docWidth = document.documentElement.clientWidth
  let editorHeight = document.documentElement.clientHeight - 27
  const ref = useRef<"main">()
  const diff_ref = useRef<"div">()
  const sec_ref = useRef<"section">()
  const output_ref = useRef<"iframe">()
  const _theme = localStorage.getItem(__LS_EDITOR_THEME__) as any

  const toolBar_ref = useRef<"nav">()
  let toolBtns: HTMLButtonElement[]

  // refs
  const console_ref = useRef<"div">()
  const aside_console_ref = useRef<"div">()

  useEffect(async () => {
    let defaults = {
      typescript: localStorage.getItem(__LS_TS__),
      javascript: localStorage.getItem(__LS_JS__),
      css: localStorage.getItem(__LS_CSS__),
      html: localStorage.getItem(__LS_HTML__)
    }
    if (Object.keys(defaults).every(k => !defaults[k])) {
      defaults = await loadSamples()
    }

    editor = createEditor(ref.current, defaults)
    window["editor"] = editor.getInstance()
    editorHeight = editor.getSize().height

    diffEditor = createDiffEditor(diff_ref.current, "", "")
    window["diffEditor"] = diffEditor.instance
    const { width, height } = editor.getSize()
    diffEditor.setSize(width, height)

    toolBtns = Array.from(toolBar_ref.current.children) as any

    // init width, theme
    const _width = localStorage.getItem(__LS_EDITOR_WIDTH__)
    _theme && setTheme(_theme)
    _width && setEditorSize(Number(_width), editorHeight)

    // init bg
    const bgImage = localStorage.getItem(__LS_BG__)
    if (bgImage) {
      document.body.style.backgroundImage = `url(${bgImage})`
    }
    const bgOp = localStorage.getItem(__LS_BG_OP__)
    if (bgOp) {
      document.body.style.opacity = String(Number(bgOp) / 100)
    }

    // listeners
    addUploadListener(({ name, type, content }) => {
      if (type === "text/html") {
        FILES.html = name
        editor.changeModel("html")
        editor.setValue("html", content)
        activeBtn(1)
        FILES.current = "html"
      } else if (type === "text/css") {
        FILES.css = name
        editor.changeModel("css")
        editor.setValue("css", content)
        activeBtn(2)
        FILES.current = "css"
      } else if (type === "text/javascript") {
        FILES.javascript = name
        editor.changeModel("javascript")
        editor.setValue("javascript", content)
        activeBtn(3)
        FILES.current = "javascript"
      } else if (name.endsWith(".tsx")) {
        FILES.typescript = name
        editor.changeModel("typescript")
        editor.setValue("typescript", content)
        activeBtn(4)
        FILES.current = "typescript"
      }
      run()
    })

    // execute scripts
    const scripts = localStorage.getItem(__LS_ARG__)
    eval(scripts)

    await addDefaultDeclarations()

    // export apis
    window["compileTS"] = async () => {
      const result = await compileTS(editor.getModel("typescript").uri)
      console.log(result)
      return result
    }

    // init finished
    LOADING.destroy()

    run()
  })

  const run = async () => {
    output_ref.current.srcdoc = "[TS]: Compiling..."
    const code = await makeSandCode(editor)
    output_ref.current.srcdoc = code
  }

  // console receive
  let consoleContent = ""
  const clearConsole = () => {
    consoleContent = ""
    console_ref.current.innerHTML = consoleContent
  }
  const console_style = `line-height:1.5rem;border-bottom: 1px solid #e8e8e8;`
  window.addEventListener("message", event => {
    const data = event.data
    if (data.method === "console") {
      consoleContent += `<pre style="${console_style}">${data.value}</pre>`
      console_ref.current.innerHTML = consoleContent
    }

    if (data.method === "console-error") {
      consoleContent += `<pre style="${console_style}color: red;">${
        data.value
      }</pre>`
      console_ref.current.innerHTML = consoleContent
    }
  })

  const activeBtn = (target: EventTarget | number) => {
    for (const btn of toolBtns) {
      if (btn.tagName === "BUTTON") {
        btn.className = "ButtonHigh"
      }
    }
    if (typeof target === "number") {
      toolBtns[target]["className"] = "ButtonHigh ButtonHigh-Active"
    } else {
      target["className"] = "ButtonHigh ButtonHigh-Active"
    }
  }
  const changeAllBtnsDisabled = (disabled = true) => {
    toolBtns[1]["disabled"] = disabled
    toolBtns[2]["disabled"] = disabled
    toolBtns[3]["disabled"] = disabled
    toolBtns[4]["disabled"] = disabled
  }

  const aside_ref = useRef<"aside">()
  const asideSize_ref = useRef<"div">()

  const setTheme = (theme: "vs" | "vs-dark" | "hc-black") => {
    editor.setTheme(theme)
    localStorage.setItem(__LS_EDITOR_THEME__, theme)
    if (theme === "vs") {
      document.body.style.backgroundColor = "white"
    } else {
      document.body.style.backgroundColor = "black"
    }
  }

  const setEditorSize = (width: number, height: number) => {
    sec_ref.current.style.width = width + "px"
    const asideWidth = docWidth - width
    aside_ref.current.style.width = asideWidth + "px"
    editor.setSize(width, height)
    diffEditor.setSize(width, height)
    asideSize_ref.current.textContent = `${asideWidth} x ${height}`
    localStorage.setItem(__LS_EDITOR_WIDTH__, String(width))
  }

  const dl_ref = useRef<"a">()

  function download(type: "file" | "index" = "file") {
    const aLink = dl_ref.current
    let fileName: string
    let content: string

    if (type === "file") {
      if (FILES.current === "javascript") {
        fileName = FILES.javascript
        content = editor.getValue("javascript")
      } else if (FILES.current === "css") {
        fileName = FILES.css
        content = editor.getValue("css")
      } else if (FILES.current === "html") {
        fileName = FILES.html
        content = editor.getValue("html")
      } else if (FILES.current === "typescript") {
        fileName = FILES.typescript
        content = editor.getValue("typescript")
      }
    }

    if (type === "index") {
      fileName = "index.html"
      content = getSandBoxEmit(output_ref.current)
      run() // reset iframe document.
    }

    const blob = new Blob([content])
    aLink.download = fileName
    aLink.href = URL.createObjectURL(blob)
    aLink.click()
  }

  // diff
  let diff_flag = false
  let diffEditor: DiffEditorAPI = null

  const switchDiff = () => {
    if (diff_flag) {
      ref.current.style.display = "block"
      diff_ref.current.style.display = "none"
      diff_flag = false
      changeAllBtnsDisabled(false)

      // restore state when load.
      const state = editor.getState(FILES.current)
      const instance = editor.getInstance()
      instance.restoreViewState(state)
      instance.focus()
    } else {
      ref.current.style.display = "none"
      diff_ref.current.style.display = "block"
      diff_flag = true
      changeAllBtnsDisabled(true)

      // save state before unload
      const instance = editor.getInstance()
      const state = instance.saveViewState()
      editor.setState(FILES.current, state)

      const value = editor.getValue()
      if (diffEditor) {
        diffEditor.modifiedModel.setValue(value)
        diffEditor.originalModel.setValue(value)
      }
    }
  }

  const saveModified = () => {
    if (diffEditor) {
      const value = diffEditor.instance.getModifiedEditor().getValue()
      editor.setValue(value)
      run()
    }
  }

  // console btn
  let console_flag = false
  const switchConsole = event => {
    if (console_flag) {
      aside_console_ref.current.style.transform = "translate(0, 0)"
      console_flag = false
      event.target.innerHTML = "[hide]"
    } else {
      aside_console_ref.current.style.transform = "translate(0, 90%)"
      console_flag = true
      event.target.innerHTML = "[show]"
    }
  }

  // fixed docWidth
  window.addEventListener("resize", () => {
    docWidth = document.documentElement.clientWidth
  })

  return (
    <div className="App">
      <section ref={sec_ref} className="Main">
        <nav ref={toolBar_ref} className="ToolBar">
          <div
            style={{
              borderBottom: "1px solid #ababab",
              width: "0.5rem"
            }}
          />
          <button
            className="ButtonHigh"
            onclick={e => {
              editor.changeModel("html")
              activeBtn(e.target)
              FILES.current = "html"
            }}
          >
            HTML
          </button>
          <button
            className="ButtonHigh"
            onclick={e => {
              editor.changeModel("css")
              activeBtn(e.target)
              FILES.current = "css"
            }}
          >
            CSS
          </button>
          <button
            className="ButtonHigh"
            onclick={e => {
              editor.changeModel("javascript")
              activeBtn(e.target)
              FILES.current = "javascript"
            }}
          >
            JS
          </button>
          <button
            className="ButtonHigh ButtonHigh-Active"
            onclick={e => {
              editor.changeModel("typescript")
              activeBtn(e.target)
              FILES.current = "typescript"
            }}
          >
            TS
          </button>
          <div
            style={{
              flexGrow: "1",
              borderBottom: "1px solid #ababab"
            }}
          />
          <button
            className="ButtonHigh"
            onclick={() => openModel(ModuleManager)}
          >
            Module
          </button>
          <button className="ButtonHigh" onclick={switchDiff}>
            Diff
          </button>
          <select
            className="ButtonHigh"
            oninput={e => setTheme(e.target["value"])}
          >
            <option selected={_theme === "vs"} value="vs">
              Light
            </option>
            <option selected={_theme === "vs-dark"} value="vs-dark">
              Dark
            </option>
            <option selected={_theme === "hc-black"} value="hc-black">
              Black
            </option>
          </select>
          <button
            className="ButtonHigh"
            onclick={() => openModel(({ close }) => <Settings close={close} />)}
          >
            Settings
          </button>
          <button
            className="ButtonHigh"
            style={{ float: "right" }}
            onclick={() => download("file")}
          >
            Download
          </button>
        </nav>
        <main className="Editor" ref={ref} onkeyup={() => debounce(run)} />
        <div
          className="DiffEditor"
          ref={diff_ref}
          onkeyup={() => debounce(saveModified)}
        />
      </section>
      <aside ref={aside_ref} className="Aside">
        <div
          className="Aside-Btn"
          ref={el =>
            addDragListener(
              el,
              e => {
                setEditorSize(e.clientX, editorHeight)
              },
              () => {
                output_ref.current.style.display = "none"
                aside_console_ref.current.style.display = "none"
                asideSize_ref.current.style.display = "block"
              },
              () => {
                output_ref.current.style.display = "block"
                aside_console_ref.current.style.display = "block"
                asideSize_ref.current.style.display = "none"
                localStorage.setItem(
                  __LS_EDITOR_WIDTH__,
                  sec_ref.current.style.width.replace("px", "")
                )
              }
            )
          }
        />
        <div className="Aside-Run">
          <button className="ButtonHigh" onclick={run}>
            Run
          </button>
          <button className="ButtonHigh" onclick={() => download("index")}>
            Export
          </button>
          <div style={{ flexGrow: "1" }} />
          <div
            style={{
              lineHeight: "1.5rem",
              color: "#d5d5d7",
              wordBreak: "break-all",
              userSelect: "none",
              padding: "0 0.5rem"
            }}
          >
            v{__VERSION__} by saber2pr
          </div>
        </div>
        <iframe ref={output_ref} />
        <div ref={aside_console_ref} className="Aside-Console">
          <div className="Console-Bar">
            <div style={{ flexGrow: "1" }}>Console</div>
            <div className="Console-Bar-Btn" onclick={clearConsole}>
              [clear]
            </div>
            <div className="Console-Bar-Btn" onclick={switchConsole}>
              [hide]
            </div>
          </div>
          <div ref={console_ref} className="Console-Output" />
        </div>
        <div className="Aside-Size" ref={asideSize_ref} />
      </aside>
      <a ref={dl_ref} />
    </div>
  )
}

render(<App />, document.getElementById("root"))
