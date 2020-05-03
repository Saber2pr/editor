// 1. config requirejs
const packages = __VAR_JSON__.dependencies
const oldLoad = requirejs.load
requirejs.load = function (context, id, url) {
  if (id in packages) {
    url = packages[id]
  }
  return oldLoad.call(requirejs, context, id, url)
}

// 2. declarations config
// please remove it before sandbox exports.
// api docs:https://github.com/Saber2pr/editor/blob/master/doc/script.md
if (top !== self) {
  if (!top._finished) {
    top.LOADING.init()
    console.log('wait for types fetching...')
    const types = __VAR_JSON__.types
    Promise
      .all(Object
        .keys(types)
        .map(name => top.api_addModuleDeclaration(types[name], name)))
      .then(() => {
        console.log('types inited.')
        top.LOADING.destroy()
      })
    top._finished = true
  }
}

// 3. enjoy it!
console.log(__VAR_JSON__.name, new Date().toLocaleString())
