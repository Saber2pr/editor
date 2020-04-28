// 1. config requirejs
// --- or import lib from url, like
// --- import React from 'https://cdn.bootcss.com/react/16.13.1/umd/react.production.min.js'
const oldLoad = requirejs.load
requirejs.load = function (context, id, url) {
  if (id === 'react') {
    url = 'https://cdn.bootcss.com/react/16.13.1/umd/react.production.min.js'
  }

  if (id === 'react-dom') {
    url = 'https://cdn.bootcss.com/react-dom/16.13.1/umd/react-dom.production.min.js'
  }

  if (id === 'axios') {
    url = 'https://cdn.bootcss.com/axios/0.19.2/axios.min.js'
  }

  return oldLoad.call(requirejs, context, id, url)
}

// 2. enjoy it!
console.log('o(*≧▽≦)ツ┏━┓', new Date().toLocaleString())

