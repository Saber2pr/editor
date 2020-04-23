interface Defaults {
  javascript: string
  typescript: string
  css: string
  html: string
}

export const loadSamples = async (): Promise<Defaults> => {
  const html = await fetch("/libs/samples/index.html").then(res => res.text())
  const javascript = await fetch("/libs/samples/main.js").then(res =>
    res.text()
  )
  const typescript = await fetch("/libs/samples/main.tsx").then(res =>
    res.text()
  )
  const css = await fetch("/libs/samples/style.css").then(res => res.text())

  return {
    javascript,
    typescript,
    css,
    html
  }
}
