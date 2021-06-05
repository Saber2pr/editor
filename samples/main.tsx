import ReactDOM from 'react-dom'
import React, { useState, useEffect, useRef } from 'react'
const mountNode = document.getElementById('root')

import { message } from 'antd'

import axios from 'axios'
// console.log(axios.get)

interface App {
  github: string
}

const App = ({ github }: App) => {
  const [state, setState] = useState(0)
  const btn = useRef<HTMLButtonElement>()

  useEffect(() => {
    btn.current.style.animation = 'shake 2s ease infinite'
    message.info('hello~ antd design')
  }, [])

  return <div>
    <div className="title">
      <i>Code SandBox</i>
    </div>
    <p style={{ color: 'grey' }}>Fork on Github:
        <a href={github} target="_blank">Saber2pr/editor</a>
    </p>
    <div>
      click to add: {state}
      <div>
        <button ref={btn} onClick={() => {
          message.info('hello~ antd design')
          setState(state + 1)
        }}>setState(state + 1)</button>
      </div>
    </div>
  </div>
}

ReactDOM.render(<App github="https://github.com/Saber2pr/editor" />,
  mountNode)
