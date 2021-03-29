export default { install }

function install(Vue) {
  const keyActions = {}

  Vue.directive('key', {
    mounted(el, binding) {
      keyActions[binding.value] = () => el.click()
    },
    unmounted(el, binding) {
      delete keyActions[binding.value]
    },
  })

  document.addEventListener('keyup', event => {
    const keyAction = keyActions[event.key]
    if (keyAction) keyAction.call(this)
  })
}
