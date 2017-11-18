let option = {}


export default {
  init,
}


function init() {
  chrome.extension.sendMessage({ 'request': 'options' }, response => {
    option = response // all our options are based on background.js which should be considered authoritative
    restore_options()

    $('#options-form').submit(e => {
      e.preventDefault()
      save_options()
    })
  })
}
function restore_options() {
  Object.keys(option).forEach(key => {
    const node = document.querySelector(`[data-option="${key}"]`)
    if (!node) {
      return console.error('Node for option %s is not found', key)
    }

    switch (node.type) {
      case 'checkbox':
        node.checked = option[key]
        break
      default:
        node.value = option[key]
    }
  })
}
function save_options() {
  const inputParsers = {
    checkbox: node => node.checked,
    number: node => (Math.abs(Math.round(node.value)) || 0).toString(),
    default: node => node.value,
  }

  const $options = Array.from(document.querySelectorAll('[data-option]'))

  $options.forEach(node => {
    const accessor = inputParsers[node.type] || inputParsers.default
    option[node.dataset.option] = accessor(node)
  })

  chrome.extension.sendMessage({
    request: 'options_set',
    option: option,
  }, animateOptionsSave)
}
function animateOptionsSave() {
  window.alert('Options updated.')
}
