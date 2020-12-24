export default { install }

function install(Vue) {
  const keyActions = {}

  Vue.directive('key', {
    bind(el, binding) {
      keyActions[binding.value] = () => el.click()
    },
    unbind(el, binding) {
      delete keyActions[binding.value]
    },
  })

  document.addEventListener('keyup', event => {
    const keyAction = keyActions[event.key]
    if (keyAction) keyAction.call(this)
  })
}
