/*
 * @Author: saber2pr
 * @Date: 2020-04-12 15:39:32
 * @Last Modified by: saber2pr
 * @Last Modified time: 2020-04-12 16:37:43
 */
import TSX, { useRef } from "@saber2pr/tsx"
import { __LS_BG__, __LS_BG_OP__, __LS_ARG__ } from "../../constants"
import "./settings.css"

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
            <th title="execute when editor running">script</th>
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
