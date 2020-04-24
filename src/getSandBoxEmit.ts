/*
 * @Author: saber2pr
 * @Date: 2020-04-24 14:00:55
 * @Last Modified by: saber2pr
 * @Last Modified time: 2020-04-24 14:58:27
 */
export const getSandBoxEmit = (sandbox: HTMLIFrameElement) => {
  const doc = sandbox.contentDocument

  // remove hook
  const console_hook = doc.querySelector('script[data-type="console-hook"]')
  console_hook.remove()

  // remove amd-modules loaded.
  const requiremodule = doc.querySelectorAll("script[data-requiremodule]")
  if (requiremodule.length) {
    requiremodule.forEach(n => n.remove())
  }

  return `<html>${doc.firstElementChild.innerHTML}</html>`
}
