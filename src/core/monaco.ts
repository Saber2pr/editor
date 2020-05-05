/*
 * @Author: saber2pr
 * @Date: 2020-05-05 20:55:00
 * @Last Modified by: saber2pr
 * @Last Modified time: 2020-05-05 21:14:08
 */
import * as Monaco from "monaco-editor/esm/vs/editor/editor.main.js"
export type IMonaco = typeof import("monaco-editor")

export const monaco = Monaco as IMonaco
