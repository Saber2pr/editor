/*
 * @Author: saber2pr
 * @Date: 2020-05-05 20:24:29
 * @Last Modified by: saber2pr
 * @Last Modified time: 2020-05-05 20:29:34
 */
const os = require("os")

export = function getLocalIP() {
  const interfaces = os.networkInterfaces()
  for (const name of Object.keys(interfaces)) {
    for (const interf of interfaces[name]) {
      const { address, family, internal } = interf
      if (family === "IPv4" && !internal) {
        return address
      }
    }
  }
}
