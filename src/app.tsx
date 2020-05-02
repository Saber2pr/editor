/*
 * @Author: saber2pr
 * @Date: 2020-04-22 22:36:26
 * @Last Modified by: saber2pr
 * @Last Modified time: 2020-04-30 14:44:49
 */
declare const LOADING: { init(): void; destroy(): void }

import TSX, { useRef, useEffect, render } from "@saber2pr/tsx"
import {
  createEditor,
  EditorAPI,
  DiffEditorAPI,
  createDiffEditor,
  compileTS
} from "./createEditor"
import "./app.css"
import {
  __LS_JS__,
  __LS_TS__,
  __LS_CSS__,
  __LS_HTML__,
  __LS_CUR_TAB__,
  __LS_EDITOR_THEME__,
  __LS_EDITOR_WIDTH__,
  __LS_EDITOR_CONS_HEIGHT__,
  __VERSION__,
  __LS_BG__,
  __LS_BG_OP__,
  __LS_ARG__,
  __LS_JSON__,
  __MESSAGE_CONSOLE__,
  __MESSAGE_CONSOLE_ERROR__
} from "./constants"
import { openModel } from "./components/model/model"
import { Settings } from "./components/settings/settings"
import { debounce, addDragListener, addUploadListener } from "./utils"
import { loadSamples, loadScript } from "./samples"
import { makeSandCode } from "./makeSandCode"
import { initKeyBoard } from "./keyboard"

const FILES = {
  current: "typescript",
  javascript: "main.js",
  typescript: "main.tsx",
  json: "data.json",
  css: "style.css",
  html: "index.html"
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
      html: localStorage.getItem(__LS_HTML__),
      json: localStorage.getItem(__LS_JSON__)
    }
    if (Object.keys(defaults).every(k => !defaults[k])) {
      defaults = await loadSamples()
    }

    editor = createEditor(ref.current, defaults)
    window["api_editor"] = editor.getInstance()
    editorHeight = editor.getSize().height

    toolBtns = Array.from(toolBar_ref.current.children) as any

    // init width, theme
    const _width = localStorage.getItem(__LS_EDITOR_WIDTH__)
    _theme && setTheme(_theme)
    _width && setEditorSize(Number(_width), editorHeight)
    // init console height
    const _consHeight = localStorage.getItem(__LS_EDITOR_CONS_HEIGHT__)
    if (_consHeight) {
      aside_console_ref.current.style.height = _consHeight
    }

    // init bg
    const bgImage = localStorage.getItem(__LS_BG__)
    if (bgImage) {
      document.body.style.backgroundImage = `url(${bgImage})`
    }
    const bgOp = localStorage.getItem(__LS_BG_OP__)
    if (bgOp && bgImage) {
      document.body.style.opacity = String(Number(bgOp) / 100)
    } else {
      document.body.style.opacity = '1'
    }

    // init current tab
    const tabIndex = Number(localStorage.getItem(__LS_CUR_TAB__) || "4")
    activeBtn(tabIndex)

    // listeners
    addUploadListener(({ name, type, content }) => {
      if (type === "text/html") {
        FILES.html = name
        editor.setValue("html", content)
        activeBtn(1)
      } else if (type === "text/css") {
        FILES.css = name
        editor.setValue("css", content)
        activeBtn(2)
      } else if (type === "text/javascript") {
        FILES.javascript = name
        editor.setValue("javascript", content)
        activeBtn(3)
      } else if (name.endsWith(".tsx") || name.endsWith(".ts")) {
        FILES.typescript = name
        editor.setValue("typescript", content)
        activeBtn(4)
      } else if (name.endsWith(".json")) {
        FILES.json = name
        editor.setValue("json", content)
        activeBtn(5)
      }
      run()
    })

    // init keyboard
    initKeyBoard({
      onSave() {
        run()
      }
    })

    // export apis
    window["api_compileTS"] = async () => {
      const result = await compileTS(editor.getModel("typescript").uri)
      console.log(result)
      return result
    }
    window["api_makeSandCode"] = (mode: "dev" | "pro" = "dev") =>
      makeSandCode(editor, mode)

    // execute script
    let script = localStorage.getItem(__LS_ARG__)
    if (!script) {
      script = await loadScript()
      localStorage.setItem(__LS_ARG__, script)
    }

    // init finished
    LOADING.destroy()

    eval(script)

    run()
  })

  const run = async () => {
    output_ref.current.srcdoc = "[TS]: Compiling..."
    const code = await makeSandCode(editor, "dev")
    output_ref.current.srcdoc = code
  }

  // console receive
  let consoleContent = ""
  const clearConsole = () => {
    consoleContent = ""
    console_ref.current.innerHTML = consoleContent
  }
  const console_style = `line-height:1.5rem;border-bottom: 1px solid #e8e8e8;`
  const pushConsole = () => {
    console_ref.current.innerHTML = consoleContent
    console_ref.current.scrollTo({
      top: console_ref.current.scrollHeight,
      behavior: "smooth"
    })
  }
  window.addEventListener("message", event => {
    const data = event.data
    if (data.method === __MESSAGE_CONSOLE__) {
      consoleContent += `<pre style="${console_style}">${data.value}</pre>`
      pushConsole()
    }
    if (data.method === __MESSAGE_CONSOLE_ERROR__) {
      consoleContent += `<pre style="${console_style}color: red;">${
        data.value
      }</pre>`
      pushConsole()
    }
  })

  const activeBtn = (target: number) => {
    for (const btn of toolBtns) {
      if (btn.tagName === "BUTTON") {
        btn.className = "ButtonHigh"
      }
    }
    toolBtns[target]["className"] = "ButtonHigh ButtonHigh-Active"

    let type = null
    if (target === 1) {
      type = "html"
    } else if (target === 2) {
      type = "css"
    } else if (target === 3) {
      type = "javascript"
    } else if (target === 4) {
      type = "typescript"
    } else if (target === 5) {
      type = "json"
    }

    if (type) {
      editor.changeModel(type)
      FILES.current = type
      localStorage.setItem(__LS_CUR_TAB__, String(target))
    }
  }

  const changeAllBtnsDisabled = (disabled = true) => {
    toolBtns[1]["disabled"] = disabled
    toolBtns[2]["disabled"] = disabled
    toolBtns[3]["disabled"] = disabled
    toolBtns[4]["disabled"] = disabled
    toolBtns[5]["disabled"] = disabled
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
    editor.setSize(width, height)
    const asideWidth = docWidth - width
    if (diffEditor) {
      diffEditor.setSize(width, height)
      aside_ref.current.style.width = asideWidth + "px"
    }
    asideSize_ref.current.textContent = `${asideWidth} x ${height}`
  }

  const dl_ref = useRef<"a">()

  async function download(type: "file" | "index" = "file") {
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
      } else if (FILES.current === "json") {
        fileName = FILES.json
        content = editor.getValue("json")
      }
    }

    if (type === "index") {
      fileName = "index.html"
      content = await makeSandCode(editor, "pro")
    }

    const blob = new Blob([content])
    aLink.download = fileName
    aLink.href = URL.createObjectURL(blob)
    aLink.click()
  }

  // diff
  let diffEditor: DiffEditorAPI = null

  const openDiffEditor = () => {
    diffEditor = createDiffEditor(diff_ref.current, "", "")
    window["api_diffEditor"] = diffEditor.instance
    const { width, height } = editor.getSize()
    diffEditor.setSize(width, height)
  }

  const closeDiffEditor = () => {
    if (diffEditor) {
      diffEditor.instance.dispose()
      diffEditor = null
      window["api_diffEditor"] = null
    }
  }

  const switchDiff = () => {
    if (diffEditor) {
      // close diff
      closeDiffEditor()
      diff_ref.current.style.display = "none"
      ref.current.style.display = "block"
      changeAllBtnsDisabled(false)

      // restore state when load.
      const state = editor.getState(FILES.current)
      const instance = editor.getInstance()
      instance.restoreViewState(state)
      instance.focus()
    } else {
      // open diff
      ref.current.style.display = "none"
      diff_ref.current.style.display = "block"
      changeAllBtnsDisabled(true)
      openDiffEditor()

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
          <button className="ButtonHigh" onclick={() => activeBtn(1)}>
            HTML
          </button>
          <button className="ButtonHigh" onclick={() => activeBtn(2)}>
            CSS
          </button>
          <button className="ButtonHigh" onclick={() => activeBtn(3)}>
            JS
          </button>
          <button
            className="ButtonHigh ButtonHigh-Active"
            onclick={() => activeBtn(4)}
          >
            TS
          </button>
          <button
            className="ButtonHigh"
            title="var __VAR_JSON__"
            onclick={() => activeBtn(5)}
          >
            JSON
          </button>
          <div
            style={{
              flexGrow: "1",
              borderBottom: "1px solid #ababab"
            }}
          />
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
            Profile
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
              e => setEditorSize(e.clientX, editorHeight),
              () => {
                output_ref.current.style.display = "none"
                asideSize_ref.current.style.display = "block"
                aside_console_ref.current.style.display = "none"
              },
              e => {
                asideSize_ref.current.style.display = "none"
                output_ref.current.style.display = "block"
                aside_console_ref.current.style.display = "block"
                localStorage.setItem(__LS_EDITOR_WIDTH__, String(e.clientX))
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
        <div className="Aside-Size" ref={asideSize_ref} />
        <div ref={aside_console_ref} className="Aside-Console">
          <div className="Console-Bar">
            <div style={{ flexGrow: "1" }}>Console</div>
            <div className="Console-Bar-Btn" onclick={clearConsole}>
              [clear]
            </div>
            <div
              className="Console-Btn"
              ref={el =>
                addDragListener(
                  el,
                  e => {
                    const consHeight = `calc(100vh - ${e.clientY - 20}px)`
                    aside_console_ref.current.style.height = consHeight
                  },
                  () => {
                    output_ref.current.style.display = "none"
                    asideSize_ref.current.style.display = "block"
                  },
                  e => {
                    asideSize_ref.current.style.display = "none"
                    output_ref.current.style.display = "block"
                    const consHeight = `calc(100vh - ${e.clientY - 20}px)`
                    localStorage.setItem(__LS_EDITOR_CONS_HEIGHT__, consHeight)
                  }
                )
              }
            />
          </div>
          <div ref={console_ref} className="Console-Output" />
        </div>
      </aside>
      <a ref={dl_ref} />
    </div>
  )
}

render(<App />, document.getElementById("root"))
