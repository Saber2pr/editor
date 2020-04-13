/*
 * @Author: saber2pr
 * @Date: 2020-04-12 15:28:47
 * @Last Modified by: saber2pr
 * @Last Modified time: 2020-04-12 15:51:53
 */
import { render } from "@saber2pr/tsx"
import "./model.css"

type ModelAPI = { close: Function }

export const openModel = (message: (api: ModelAPI) => JSX.Element) => {
  const container = document.createElement("div")
  document.body.append(container)
  container.className = "Model"

  const close = () => {
    document.body.removeChild(container)
  }

  const api = { close }

  render(message(api), container)
  return api
}
