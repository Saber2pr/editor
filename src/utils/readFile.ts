export const readFile = (file: File) =>
  new Promise<FileInfo>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () =>
      resolve({
        content: String(reader.result),
        name: file.name,
        type: file.type
      })
    reader.onerror = () => reject(reader.result)
    reader.readAsText(file)
  })

export type FileInfo = {
  name: string
  type: string
  content: string
}
