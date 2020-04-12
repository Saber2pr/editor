/*
 * @Author: saber2pr
 * @Date: 2020-04-12 21:03:23
 * @Last Modified by: saber2pr
 * @Last Modified time: 2020-04-12 22:37:09
 */
export const debounce = (callback: Function, delta = 1000, id = "default") => {
  clearTimeout(debounce[id])
  debounce[id] = setTimeout(callback, delta)
}

export const addDragListener = (
  target: HTMLElement,
  callback: (event: MouseEvent) => void,
  onDragStart?: (event: MouseEvent) => void,
  onDragEnd?: (event: MouseEvent) => void
) => {
  let lock = false
  target.onmousedown = event => {
    lock = true
    onDragStart && onDragStart(event)
  }
  document.onmousemove = event => {
    if (lock) {
      callback(event)
    }
  }
  target.onmouseup = event => {
    lock = false
    onDragEnd && onDragEnd(event)
  }
}

export const readFile = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(reader.result)
    reader.readAsText(file)
  })

type FileInfo = {
  name: string
  type: string
  content: string
}

export const addUploadListener = (callback: (res: FileInfo) => void) => {
  document.addEventListener("dragover", e => e.preventDefault())
  document.addEventListener("drop", event => {
    event.preventDefault()
    const dt = event.dataTransfer
    const file = dt.files[0]
    readFile(file).then(content =>
      callback({ name: file.name, type: file.type, content })
    )
  })
}
