interface Defaults {
  javascript: string
  typescript: string
  css: string
  html: string
  json: string
}

const isProd = process.env.NODE_ENV === 'production'
const base = isProd ? '//saber2pr.github.io/editor' : ''

const samples = [
  "/samples/main.tsx",
  "/samples/main.js",
  "/samples/style.css",
  "/samples/index.html",
  "/samples/data.json"
]

export const loadSamples = async (): Promise<Defaults> => {
  const [typescript, javascript, css, html, json] = await Promise.all(
    samples.map(sample => fetch(base + sample).then(res => res.text()))
  )

  return {
    typescript,
    javascript,
    css,
    html,
    json
  }
}

export const settings = {
  script: "/samples/script.js"
}

export const loadScript = () => fetch(base + settings.script).then(res => res.text())
