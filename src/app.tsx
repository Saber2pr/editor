/*
 * @Author: saber2pr
 * @Date: 2020-04-10 16:37:35
 * @Last Modified by: saber2pr
 * @Last Modified time: 2020-04-12 22:37:05
 */
import TSX, { useRef, useEffect, render } from "@saber2pr/tsx"
import {
  createEditor,
  EditorAPI,
  DiffEditorAPI,
  createDiffEditor
} from "./createEditor"
import "./app.css"
import {
  __LS_JS__,
  __LS_CSS__,
  __LS_HTML__,
  __LS_EDITOR_THEME__,
  __LS_EDITOR_WIDTH__,
  __VERSION__,
  __LS_BG__,
  __LS_BG_OP__
} from "./constants"
import { openModel } from "./components/model/model"
import { Settings } from "./components/settings/settings"
import { debounce, addDragListener, addUploadListener } from "./utils"

const defaults = {
  javascript: localStorage.getItem(__LS_JS__) || `// input code here...\n`,
  css: localStorage.getItem(__LS_CSS__),
  html: localStorage.getItem(__LS_HTML__)
}

const FILES = {
  current: "javascript",
  javascript: "main.js",
  css: "style.css",
  html: "index.html"
}

const App = () => {
  let editor: EditorAPI
  const docWidth = document.documentElement.clientWidth
  let editorHeight = document.documentElement.clientHeight - 27
  const ref = useRef<"main">()
  const diff_ref = useRef<"div">()
  const sec_ref = useRef<"section">()
  const output_ref = useRef<"iframe">()
  const _theme = localStorage.getItem(__LS_EDITOR_THEME__) as any

  const toolBar_ref = useRef<"nav">()
  let toolBtns: HTMLButtonElement[]

  useEffect(() => {
    editor = createEditor(ref.current, defaults)
    window["editor"] = editor.getInstance()
    editorHeight = editor.getSize().height

    diffEditor = createDiffEditor(diff_ref.current, "", "")
    window["diffEditor"] = diffEditor.instance

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
      if (type === "text/javascript") {
        FILES.javascript = name
        editor.changeModel("javascript")
        editor.setValue("javascript", content)
        activeBtn(3)
        FILES.current = "javascript"
      } else if (type === "text/html") {
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
      }
      run()
    })
  })

  const run = () => {
    const js = editor.getValue("javascript")
    const html = editor.getValue("html")
    const css = editor.getValue("css")

    js && localStorage.setItem(__LS_JS__, js)
    html && localStorage.setItem(__LS_HTML__, html)
    css && localStorage.setItem(__LS_CSS__, css)

    output_ref.current.srcdoc = `<style>${editor.getValue(
      "css"
    )}</style>${editor.getValue("html")}<script>${editor.getValue(
      "javascript"
    )}</script>`
  }

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
  const changeAllBtnsDisabled = (enable = true) => {
    toolBtns[1]["disabled"] = enable
    toolBtns[2]["disabled"] = enable
    toolBtns[3]["disabled"] = enable
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

  function download() {
    const aLink = dl_ref.current
    let fileName: string
    let content: string

    if (FILES.current === "javascript") {
      fileName = FILES.javascript
      content = editor.getValue("javascript")
    } else if (FILES.current === "css") {
      fileName = FILES.css
      content = editor.getValue("css")
    } else if (FILES.current === "html") {
      fileName = FILES.html
      content = editor.getValue("html")
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
            className="ButtonHigh ButtonHigh-Active"
            onclick={e => {
              editor.changeModel("javascript")
              activeBtn(e.target)
              FILES.current = "javascript"
            }}
          >
            JS
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
            Settings
          </button>
          <button
            className="ButtonHigh"
            style={{ float: "right" }}
            onclick={download}
          >
            Download
          </button>
        </nav>
        <main className="Editor" ref={ref} onkeydown={() => debounce(run)} />
        <div
          className="DiffEditor"
          ref={diff_ref}
          onkeydown={() => debounce(saveModified)}
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
                asideSize_ref.current.style.display = "block"
              },
              () => {
                output_ref.current.style.display = "block"
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
      </aside>
      <a ref={dl_ref} />
    </div>
  )
}

render(<App />, document.getElementById("root"))
