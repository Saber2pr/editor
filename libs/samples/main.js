// 1. config requirejs
// --- or import lib from url, like
// --- import React from 'https://cdn.bootcss.com/react/16.13.1/umd/react.production.min.js'
const oldLoad = requirejs.load
requirejs.load = function (context, id, url) {
  if (id === 'react') {
    url = 'https://cdn.bootcss.com/react/16.13.1/umd/react.production.min.js'
  }

  if (id === 'react-dom') {
    url = 'https://cdn.bootcss.com/react-dom/16.13.1/umd/react-dom.development.min.js'
  }

  if (id === 'axios') {
    url = 'https://cdn.bootcss.com/axios/0.19.2/axios.min.js'
  }

  return oldLoad.call(requirejs, context, id, url)
}

// 2. add declarations for typescript.
top.api_addModuleDeclaration('https://www.unpkg.com/@types/react/index.d.ts', 'react')
top.api_addModuleDeclaration('https://www.unpkg.com/@types/react-dom/index.d.ts', 'react-dom')
top.api_addModuleDeclaration('https://www.unpkg.com/csstype/index.d.ts', 'csstype')
top.api_addModuleDeclaration('https://www.unpkg.com/@types/prop-types/index.d.ts', 'prop-types')
top.api_addModuleDeclaration('https://unpkg.com/axios/index.d.ts', 'axios')

// 3. do something...
const root = document.getElementById('test')
root.style.border = '1px solid'
root.style.borderRadius = '1rem'
root.style.padding = '1rem'

// 4. enjoy it!
console.log('o(*≧▽≦)ツ┏━┓', new Date().toLocaleString())
