/*
 * @Author: saber2pr
 * @Date: 2020-04-12 15:39:32
 * @Last Modified by: saber2pr
 * @Last Modified time: 2020-05-05 20:54:19
 */
declare const LOADING: { init(): void; destroy(): void }

import TSX, { useRef } from "@saber2pr/tsx"
import { KEYS } from "../../constants"
import "./style.css"
import { readFile } from "../../utils"
import { addModuleDeclaration, addExtraLib } from "../../core"

const DOC_script = "//github.com/Saber2pr/editor/blob/master/doc/script.md"

const getLSAutoRun = () => {
  const ls_auto_run = localStorage.getItem(KEYS.__LS_AUTO_RUN__) as "yes" | "no"
  return ls_auto_run === null ? "yes" : ls_auto_run
}
let isAutoRun: "yes" | "no" = getLSAutoRun()
export const shouldAutoRun = () => isAutoRun === "yes"

export const Settings = ({ close }: { close: Function }) => {
  const bg_ref = useRef<"input">()
  const bg_op_ref = useRef<"input">()
  const arg_ref = useRef<"textarea">()
  const auto_run_ref = useRef<"input">()
  const save = () => {
    const bgImage = bg_ref.current.value
    localStorage.setItem(KEYS.__LS_BG__, bgImage)
    document.body.style.backgroundImage = `url(${bgImage})`

    const bgOp = bg_op_ref.current.value
    localStorage.setItem(KEYS.__LS_BG_OP__, bgOp)

    if (bgImage) {
      document.body.style.opacity = String(Number(bgOp) / 100)
    } else {
      document.body.style.opacity = "1"
    }

    const arg = arg_ref.current.value
    localStorage.setItem(KEYS.__LS_ARG__, arg)

    const autoRun = auto_run_ref.current.checked ? "yes" : "no"
    isAutoRun = autoRun
    localStorage.setItem(KEYS.__LS_AUTO_RUN__, autoRun)

    close()
  }

  return (
    <div className="Settings">
      <table>
        <tbody>
          <tr>
            <th>background image</th>
            <td>
              <input
                type="url"
                ref={bg_ref}
                defaultValue={localStorage.getItem(KEYS.__LS_BG__) || ""}
                placeholder="input image url..."
              />
            </td>
          </tr>
          <tr>
            <th>opacity</th>
            <td>
              <input
                type="range"
                min="40"
                max="100"
                ref={bg_op_ref}
                defaultValue={localStorage.getItem(KEYS.__LS_BG_OP__) || "75"}
                oninput={() => {
                  const bgOp = bg_op_ref.current.value
                  document.body.style.opacity = String(Number(bgOp) / 100)
                }}
              />
            </td>
          </tr>
          <tr>
            <th title="execute when editor running">script</th>
            <td>
              <textarea
                defaultValue={localStorage.getItem(KEYS.__LS_ARG__) || ""}
                ref={arg_ref}
                placeholder="input scripts..."
              />
            </td>
          </tr>
          <tr>
            <th>auto-run</th>
            <td>
              <input
                type="checkbox"
                ref={el => {
                  auto_run_ref.current = el
                  el.checked = getLSAutoRun() === "yes"
                }}
              />
            </td>
          </tr>
        </tbody>
      </table>
      <br />
      <div>
        <button className="ButtonHigh" onclick={save}>
          save
        </button>
        <button className="ButtonHigh" onclick={() => close()}>
          cancel
        </button>
        <button
          className="ButtonHigh"
          onclick={() => {
            const val = confirm(
              "Reset all settings?\nwarning: this operation will clear all the data!"
            )
            if (val) {
              localStorage.clear()
              location.reload()
            } else {
              close()
            }
          }}
        >
          reset
        </button>
        <button
          className="ButtonHigh"
          onclick={() => window.open(DOC_script, "_blank")}
        >
          open-api
        </button>
      </div>
    </div>
  )
}

export const ModuleManager = ({ close }) => {
  const name_ref = useRef<"input">()
  const url_ref = useRef<"input">()

  const startLoad = async () => {
    const url = url_ref.current.value
    const moduleName = name_ref.current.value
    if (url) {
      LOADING.init()
      await addModuleDeclaration(url, moduleName)
      LOADING.destroy()
    }
    close()
  }

  return (
    <div className="Settings">
      <div>Module Manager</div>
      <p style={{ color: "grey", paddingLeft: "1rem", opacity: "0.5" }}>
        load d.ts file.
      </p>
      <br />
      <table>
        <tr>
          <th>Module Name:</th>
          <td>
            <input type="url" ref={name_ref} />
          </td>
        </tr>
        <tr>
          <th title="d.ts file's url.">DTS URL:</th>
          <td>
            <input type="url" ref={url_ref} />
          </td>
        </tr>
        <tr>
          <th>From File:</th>
          <td>
            <input
              accept=".d.ts"
              type="file"
              oninput={async e => {
                const files = e.target["files"]
                for await (const { content } of Array.from(files).map(
                  readFile
                )) {
                  addExtraLib(content)
                }
              }}
            />
          </td>
        </tr>
      </table>
      <br />
      <div>
        <button className="ButtonHigh" onclick={startLoad}>
          load
        </button>
        <button className="ButtonHigh" onclick={close}>
          cancel
        </button>
      </div>
    </div>
  )
}
