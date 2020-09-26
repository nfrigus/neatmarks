/* eslint-disable camelcase */

import open_tabs_window from './open_tabs_window'
import { commands as api } from '../../api/ChromeAPI'

const commands = {
  open_tabs_window,
}

api.onCommand
  .addListener(action => typeof commands[action] === 'function' && commands[action]())
