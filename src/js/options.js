const s = {
  action: {
    init,
    option_display_update,
    restore_options,
    save_options,
  },
  option: {},
}

function init() {
  let request = {'request': 'options'}

  let init_resume = function (response) {
    let items, i

    s.option = response // all our options are based on background.js which should be considered authoritative

    s.action.restore_options()

    items = document.querySelectorAll('input[type=checkbox]')
    for (i = 0; i < items.length; i++) {
      items[i].addEventListener('change', function () {
        s.action.option_display_update(this)
      })
    }

    items = document.querySelectorAll('.true, .false')
    for (i = 0; i < items.length; i++) {
      items[i].addEventListener('click', function (e) {
        var checkbox = this.parentElement.parentElement.parentElement.querySelector('input[type=checkbox]')
        if (!this.classList.contains(checkbox.checked.toString())) {
          checkbox.checked = !checkbox.checked
          checkbox.dispatchEvent(new Event('change'))
        }
      })
    }

    document.getElementById('save-button').addEventListener('click', function (e) {
      e.preventDefault()
      s.action.save_options()
    })
  }

  chrome.extension.sendMessage(request, init_resume)
}
function option_display_update(t, animate) {
  if (animate !== false) {
    animate = true
  }

  var checkedClass = t.checked.toString()
  var choices = t.parentElement.parentElement.querySelectorAll('.true, .false')

  for (var i = 0; i < choices.length; i++) {
    if (animate) {
      choices[i].classList.remove('no-transition')
    } else {
      choices[i].classList.add('no-transition')
    }

    if (choices[i].classList.contains(checkedClass)) {
      choices[i].classList.add('active')
    } else {
      choices[i].classList.remove('active')
    }
  }
}
function restore_options() {
  var element, i
  for (i in s.option) {
    element = document.getElementById(i)
    if (element.type === 'checkbox') {
      element.checked = s.option[i]
      s.action.option_display_update(element, false)
    } else {
      element.value = s.option[i]
    }
  }
}
function save_options() {
  const inputParsers = {
    checkbox: node => node.checked,
    number: node => (Math.abs(Math.round(element.value)) || 0).toString(),
    default: node => node.value,
  }

  for (const i in s.option) {
    const input = document.getElementById(i)
    const accessor = inputParsers[input.type] || inputParsers.default
    s.option[i] = accessor(input)
  }

  const request = {
    request: 'options_set',
    option: s.option,
  }

  chrome.extension.sendMessage(request, animate)
}
function animate() {
  document.getElementById('options-saved').classList.add('saved-animation')
  setTimeout(function () {
    document.getElementById('options-saved').classList.remove('saved-animation')
  }, 5250) // 250 ms more than the CSS animation
}

s.action.init()
