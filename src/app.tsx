/*
 * @Author: saber2pr
 * @Date: 2020-04-10 16:37:35
 * @Last Modified by: saber2pr
 * @Last Modified time: 2020-04-10 21:57:17
 */
import TSX, { useRef, useEffect, render } from "@saber2pr/tsx"
import { createEditor, EditorAPI } from "./createEditor"
import "./app.css"

const defaults = {
  typescript: localStorage.getItem("js") || `// input code here...\n`,
  css: localStorage.getItem("css"),
  html: localStorage.getItem("html")
}

const debounce = (callback: Function, delta = 300, id = "default") => {
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
  const _theme = localStorage.getItem("theme") as any

  useEffect(() => {
    editor = createEditor(ref.current, defaults)
    window["editor"] = editor.getInstance()
    editorHeight = editor.getSize().height

    const _width = localStorage.getItem("editorWidth")
    _theme && setTheme(_theme)
    _width && setEditorSize(Number(_width), editorHeight)
  })

  const run = () => {
    const js = editor.getValue("typescript")
    const html = editor.getValue("html")
    const css = editor.getValue("css")

    js && localStorage.setItem("js", js)
    html && localStorage.setItem("html", html)
    css && localStorage.setItem("css", css)

    output_ref.current.srcdoc = `<style>${editor.getValue(
      "css"
    )}</style>${editor.getValue("html")}<script>${editor.getValue(
      "typescript"
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
    localStorage.setItem("theme", theme)
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
    localStorage.setItem("editorWidth", String(width))
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
            }}
          >
            HTML
          </button>
          <button
            className="ButtonHigh"
            onclick={e => {
              editor.changeModel("css")
              activeBtn(e.target)
            }}
          >
            CSS
          </button>
          <button
            className="ButtonHigh ButtonHigh-Active"
            onclick={e => {
              editor.changeModel("typescript")
              activeBtn(e.target)
            }}
          >
            JS
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
        <main className="Editor" ref={ref} oninput={() => debounce(run)} />
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
                  "editorWidth",
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
              wordBreak: "break-all"
            }}
          >
            v0.0.1 by saber2pr&nbsp;
          </div>
        </div>
        <iframe ref={output_ref} />
        <div className="Aside-Size" ref={asideSize_ref} />
      </aside>
    </div>
  )
}

render(<App />, document.body)
