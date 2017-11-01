export default {
  get,
  merge,
  set,
}

function get(key, defaults) {
  let value = localStorage[key]

  try {
    value = JSON.parse(value)
  } catch (e) {}

  return value || defaults
}
function set(key, value) {
  localStorage[key] = JSON.stringify(value)
  return this
}
function merge(key, data) {
  if (data && "object" === typeof data)
    return set(key, Object.assign(get(key) || {}, data))

  console.error('Unable to merge', data)
  return this
}
