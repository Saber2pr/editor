import { FileInfo, readFile } from './readFile'

export const addUploadListener = (callback: (res: FileInfo) => void) => {
  document.addEventListener("dragover", e => e.preventDefault())
  document.addEventListener("drop", async event => {
    event.preventDefault()
    const dt = event.dataTransfer
    const files = dt.files
    for await (const result of Array.from(files).map(readFile)) {
      callback(result)
    }
  })
}
