// 1. config requirejs
// --- or import lib from url, like
// --- import React from 'https://cdn.bootcss.com/react/16.13.1/umd/react.production.min.js'
const packages = __VAR_JSON__.dependencies
const oldLoad = requirejs.load
requirejs.load = function(context, id, url) {
  if (id in packages) {
    url = packages[id]
  }
  return oldLoad.call(requirejs, context, id, url)
}

// 2. enjoy it!
console.log(__VAR_JSON__.name, new Date().toLocaleString())
