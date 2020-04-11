/*
 * @Author: saber2pr
 * @Date: 2020-04-10 16:37:35
 * @Last Modified by: saber2pr
 * @Last Modified time: 2020-04-10 21:57:17
 */
import TSX, { useRef, useEffect, render } from "@saber2pr/tsx"
import { createEditor, EditorAPI } from "./createEditor"
import "./app.css"

// KEYS
const __LS_JS__ = "__EDITOR_JS__"
const __LS_CSS__ = "__EDITOR_CSS__"
const __LS_HTML__ = "__EDITOR_HTML__"
const __LS_EDITOR_WIDTH__ = "__EDITOR_EDITOR_WIDTH__"
const __LS_EDITOR_THEME__ = "__EDITOR_EDITOR_THEME__"

const defaults = {
  javascript: localStorage.getItem(__LS_JS__) || `// input code here...\n`,
  css: localStorage.getItem(__LS_CSS__),
  html: localStorage.getItem(__LS_HTML__)
}

const debounce = (callback: Function, delta = 1000, id = "default") => {
  clearTimeout(debounce[id])
  debounce[id] = setTimeout(callback, delta)
}

const addDragListener = (
  target: HTMLElement,
  callback: (event: MouseEvent) => void,
  onDragStart?: (event: MouseEvent) => void,
  onDragEnd?: (event: MouseEvent) => void
) => {
  let lock = false
  target.onmousedown = event => {
    lock = true
    onDragStart && onDragStart(event)
  }
  document.onmousemove = event => {
    if (lock) {
      callback(event)
    }
  }
  target.onmouseup = event => {
    lock = false
    onDragEnd && onDragEnd(event)
  }
}

const App = () => {
  let editor: EditorAPI
  const docWidth = document.documentElement.clientWidth
  let editorHeight = document.documentElement.clientHeight - 27
  const ref = useRef<"main">()
  const sec_ref = useRef<"section">()
  const output_ref = useRef<"iframe">()
  const _theme = localStorage.getItem(__LS_EDITOR_THEME__) as any

  let current = "js"

  useEffect(() => {
    editor = createEditor(ref.current, defaults)
    window["editor"] = editor.getInstance()
    editorHeight = editor.getSize().height

    const _width = localStorage.getItem(__LS_EDITOR_WIDTH__)
    _theme && setTheme(_theme)
    _width && setEditorSize(Number(_width), editorHeight)
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

  const toolBar_ref = useRef<"nav">()
  const activeBtn = target => {
    for (const btn of Array.from(toolBar_ref.current.children)) {
      btn.className = "ButtonHigh"
    }
    target.className = "ButtonHigh ButtonHigh-Active"
  }

  const asideSize_ref = useRef<"div">()

  const setTheme = (theme: "vs" | "vs-dark" | "hc-black") => {
    editor.setTheme(theme)
    localStorage.setItem(__LS_EDITOR_THEME__, theme)
    if (theme === "vs") {
      document.body.style.background = "#ececec"
    } else {
      document.body.style.background = "black"
    }
  }

  const setEditorSize = (width: number, height: number) => {
    sec_ref.current.style.width = width + "px"
    editor.setSize(width, height)
    asideSize_ref.current.textContent = `${docWidth - width} x ${height}`
    localStorage.setItem(__LS_EDITOR_WIDTH__, String(width))
  }

  const dl_ref = useRef<"a">()

  function download() {
    const aLink = dl_ref.current
    let fileName: string
    let content: string
    const tp = Date.now()

    if (current === "js") {
      fileName = `main_${tp}.js`
      content = editor.getValue("javascript")
    } else if (current === "css") {
      fileName = `style_${tp}.css`
      content = editor.getValue("css")
    } else if (current === "html") {
      fileName = `index_${tp}.html`
      content = editor.getValue("html")
    }

    const blob = new Blob([content])
    aLink.download = fileName
    aLink.href = URL.createObjectURL(blob)
    aLink.click()
  }

  return (
    <div className="App">
      <section ref={sec_ref} className="Main">
        <nav ref={toolBar_ref} className="ToolBar">
          <button
            className="ButtonHigh"
            onclick={e => {
              editor.changeModel("html")
              activeBtn(e.target)
              current = "html"
            }}
          >
            HTML
          </button>
          <button
            className="ButtonHigh"
            onclick={e => {
              editor.changeModel("css")
              activeBtn(e.target)
              current = "css"
            }}
          >
            CSS
          </button>
          <button
            className="ButtonHigh ButtonHigh-Active"
            onclick={e => {
              editor.changeModel("javascript")
              activeBtn(e.target)
              current = "js"
            }}
          >
            JS
          </button>
          <button
            className="ButtonHigh"
            style={{ float: "right" }}
            onclick={download}
          >
            Download
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
        </nav>
        <main className="Editor" ref={ref} onkeydown={() => debounce(run)} />
      </section>
      <aside className="Aside">
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
              float: "right",
              lineHeight: "1.5rem",
              color: "#80808085",
              wordBreak: "break-all",
              userSelect: "none"
            }}
          >
            v0.0.1 by saber2pr&nbsp;
          </div>
        </div>
        <iframe ref={output_ref} />
        <div className="Aside-Size" ref={asideSize_ref} />
      </aside>
      <a ref={dl_ref} />
    </div>
  )
}

render(<App />, document.body)
