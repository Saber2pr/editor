import React, { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'

import Axios from 'axios'
console.log(Axios.get)

interface App {
  github: string
}

const App = ({ github }: App) => {
  const [state, setState] = useState(0)
  const btn = useRef<HTMLButtonElement>()

  useEffect(() => {
    btn.current.style.animation = 'shake 2s ease infinite'
  }, [])

  return <div>
    <div className="title">
      <i>SandBox for React 233</i>
    </div>
    <p style={{ color: 'grey' }}>Fork on Github:
        <a href={github} target="_blank">Saber2pr/editor</a>
    </p>
    <div>
      click to add: {state}
      <div>
        <button ref={btn} onClick={() => setState(state + 1)}>setState(state + 1)</button>
      </div>
    </div>
  </div>
}

ReactDOM.render(<App github="https://github.com/Saber2pr/editor" />, document.getElementById('test'))
