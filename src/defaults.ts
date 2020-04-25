/*
 * @Author: saber2pr
 * @Date: 2020-04-25 13:53:23
 * @Last Modified by:   saber2pr
 * @Last Modified time: 2020-04-25 13:53:23
 */
import { addModuleDeclaration } from "./createEditor"

export const addDefaultDeclarations = async () => {
  const libs: string[] = await fetch("/libs/editor/declarations.json").then(
    res => res.json()
  )
  await Promise.all(
    Object.keys(libs).map(name => {
      const url = libs[name]
      return addModuleDeclaration(url, name)
    })
  )
}
