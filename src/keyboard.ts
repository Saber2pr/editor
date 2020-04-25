/*
 * @Author: saber2pr
 * @Date: 2020-04-25 15:35:33
 * @Last Modified by: saber2pr
 * @Last Modified time: 2020-04-25 15:42:19
 */
export const initKeyBoard = ({ onSave }: { onSave: Function }) => {
  window.addEventListener("keydown", e => {
    const keyCode = e.keyCode || e.which || e.charCode
    const altKey = e.ctrlKey
    if (altKey && keyCode == 83) {
      onSave()
      e.preventDefault()
      return false
    }
  })
}
