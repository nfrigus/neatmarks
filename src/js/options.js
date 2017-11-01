const s = {
  action: {
    init,
    restore_options,
    save_options,
  },
  option: {},
}

function init() {
  chrome.extension.sendMessage({'request': 'options'}, response => {
    s.option = response // all our options are based on background.js which should be considered authoritative
    s.action.restore_options()

    $('#options-form').submit(e => {
      e.preventDefault()
      s.action.save_options()
    })
  })
}
function restore_options() {
  Object.keys(s.option).forEach(key => {
    const node = document.querySelector(`[data-option="${key}"]`)
    if (!node) {
      return console.error('Node for option %s is not found', key)
    }

    switch (node.type) {
      case 'checkbox':
        node.checked = s.option[key]
        break
      default:
        node.value = s.option[key]
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
    s.option[node.dataset.option] = accessor(node)
  })

  chrome.extension.sendMessage({
    request: 'options_set',
    option: s.option,
  }, animateOptionsSave)
}
function animateOptionsSave() {
  window.alert('Options updated.')
}

$(() => {
  s.action.init()
})
