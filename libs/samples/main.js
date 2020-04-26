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

// 2. add declarations for typescript and some themes for editor.
// --- tips: 
// ---  if you want to export the sandbox result,  
// ---  please remove all the top-api-callings below firstly.
// --- api documents: https://github.com/Saber2pr/editor/blob/master/doc/script.md
if (top != self) {
  // declarations config
  top.api_addModuleDeclaration('https://www.unpkg.com/@types/react/index.d.ts', 'react')
  top.api_addModuleDeclaration('https://www.unpkg.com/@types/react-dom/index.d.ts', 'react-dom')
  top.api_addModuleDeclaration('https://www.unpkg.com/csstype/index.d.ts', 'csstype')
  top.api_addModuleDeclaration('https://www.unpkg.com/@types/prop-types/index.d.ts', 'prop-types')
  top.api_addModuleDeclaration('https://unpkg.com/axios/index.d.ts', 'axios')

  // themes config
  const THEME_NAME = '__EDITOR_EDITOR_THEME__'
  const themer = top.document.querySelector('.ToolBar select')
  const hasTheme = theme => top.api_editor._themeService._knownThemes.has(theme)
  const base = 'https://unpkg.com/monaco-themes@0.3.3/themes/'
  if (themer.children.length === 3) {
    fetch(`${base}themelist.json`).then(res => res.json()).then(themes => {
      const current = localStorage.getItem(THEME_NAME)
      const setTheme = themeName => {
        if (hasTheme(themeName)) {
          top.monaco.editor.setTheme(themeName)
          localStorage.setItem(THEME_NAME, themeName)
        } else {
          const themeFile = themes[themeName]
          if (themeFile) {
            fetch(`${base}${themeFile}.json`)
              .then(res => res.json())
              .then(themeData => {
                if (themeData.base === 'vs') {
                  top.document.body.style.backgroundColor = 'white'
                }
                if (themeData.base === 'vs-dark') {
                  top.document.body.style.backgroundColor = 'black'
                }
                top.monaco.editor.defineTheme(themeName, themeData)
                top.monaco.editor.setTheme(themeName)
                localStorage.setItem(THEME_NAME, themeName)
              })
          }
        }
      }
      setTheme(current)
      if (themer.children.length === 3) {
        const last = current ? `<option value="${current}">${current}</option>` : ''
        const themeOps = Object.keys(themes)
          .reduce((acc, theme) => theme === current ? acc : acc +=
            `<option value="${theme}">${theme}</option>`, last)
        themer.innerHTML = themeOps + themer.innerHTML
        themer.oninput = () => setTheme(themer.value)
      }
    })
  }
}

// 3. enjoy it!
console.log('o(*≧▽≦)ツ┏━┓', new Date().toLocaleString())
