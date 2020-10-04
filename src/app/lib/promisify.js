export default function promisify(func) {
  return (...args) => new Promise(resolve => {
    func(...args, (...res) => resolve(res))
  })
}
