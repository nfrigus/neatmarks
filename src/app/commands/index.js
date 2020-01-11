/* eslint-disable camelcase */

import browser from '../lib/browser'
import open_tabs_window from './open_tabs_window'


const commands = {
  open_tabs_window,
}


browser.commands.onCommand
  .addListener(action => typeof commands[action] === 'function' && commands[action]())
