interface Defaults {
  javascript: string
  typescript: string
  css: string
  html: string
}

const samples = [
  "/libs/samples/main.tsx",
  "/libs/samples/main.js",
  "/libs/samples/style.css",
  "/libs/samples/index.html"
]

export const loadSamples = async (): Promise<Defaults> => {
  const [typescript, javascript, css, html] = await Promise.all(
    samples.map(sample => fetch(sample).then(res => res.text()))
  )

  return {
    typescript,
    javascript,
    css,
    html
  }
}

export const settings = {
  script: "/libs/samples/script.js"
}

export const loadScript = () => fetch(settings.script).then(res => res.text())
