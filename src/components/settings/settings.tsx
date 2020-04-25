/*
 * @Author: saber2pr
 * @Date: 2020-04-12 15:39:32
 * @Last Modified by: saber2pr
 * @Last Modified time: 2020-04-23 13:23:34
 */
declare const LOADING: { init(): void; destroy(): void }

import TSX, { useRef } from "@saber2pr/tsx"
import { __LS_BG__, __LS_BG_OP__, __LS_ARG__ } from "../../constants"
import "./settings.css"
import { addModuleDeclaration } from "../../createEditor"

const DOC_script =
  "https://github.com/Saber2pr/editor/blob/master/doc/script.md"

export const Settings = ({ close }: { close: Function }) => {
  const bg_ref = useRef<"input">()
  const bg_op_ref = useRef<"input">()
  const arg_ref = useRef<"textarea">()
  const save = () => {
    const bgImage = bg_ref.current.value
    localStorage.setItem(__LS_BG__, bgImage)
    document.body.style.backgroundImage = `url(${bgImage})`

    const bgOp = bg_op_ref.current.value
    localStorage.setItem(__LS_BG_OP__, bgOp)
    document.body.style.opacity = String(Number(bgOp) / 100)

    const arg = arg_ref.current.value
    localStorage.setItem(__LS_ARG__, arg)

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
                defaultValue={localStorage.getItem(__LS_BG__) || ""}
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
                defaultValue={localStorage.getItem(__LS_BG_OP__) || "75"}
                oninput={() => {
                  const bgOp = bg_op_ref.current.value
                  document.body.style.opacity = String(Number(bgOp) / 100)
                }}
              />
            </td>
          </tr>
          <tr>
            <th>
              <span title="execute when editor running">script</span>
              <a
                style="color: inherit;"
                href={DOC_script}
                title="open api document."
              >
                [doc]
              </a>
            </th>
            <td>
              <textarea
                defaultValue={localStorage.getItem(__LS_ARG__) || ""}
                ref={arg_ref}
                placeholder="input scripts..."
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
    if (url && moduleName) {
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
