/*
 * @Author: saber2pr
 * @Date: 2020-05-05 19:04:25
 * @Last Modified by: saber2pr
 * @Last Modified time: 2020-05-05 20:42:18
 */
if (
  /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i.test(
    navigator.userAgent
  )
) {
  window.addEventListener("DOMContentLoaded", function() {
    const message = document.createElement("div")
    message.style.cssText =
      "width:100vw;height:100vh;line-height:100vh;position:fixed;left:0px;top:0px;background:white;text-align:center;z-index:999;font-size:40px;"
    message.textContent = "请用PC端浏览器打开"
    document.body.append(message)
  })
}
