interface Defaults {
  javascript: string
  typescript: string
  css: string
  html: string
}

export const loadSamples = async (): Promise<Defaults> => {
  const html = await fetch("/libs/simples/index.html").then(res => res.text())
  const javascript = await fetch("/libs/simples/main.js").then(res =>
    res.text()
  )
  const typescript = await fetch("/libs/simples/main.tsx").then(res =>
    res.text()
  )
  const css = await fetch("/libs/simples/style.css").then(res => res.text())

  return {
    javascript,
    typescript,
    css,
    html
  }
}
