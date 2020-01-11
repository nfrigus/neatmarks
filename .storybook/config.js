import '@storybook/addon-console'
import { action } from '@storybook/addon-actions'
import { addParameters, configure } from '@storybook/vue'
import { themes } from '@storybook/theming'

import Vue from 'vue'
import { UiPlugin } from '../src/app/ui'


Vue.use(UiPlugin)
Vue.component('router-link', {
  template: '<a @click="onClick"><slot></slot></a>',
  methods: {
    onClick() { action(`router-link.click`)(this.$attrs) }
  },
})


addParameters({
  backgrounds: [
    { name: 'twitter', value: '#00aced', default: true },
    { name: 'facebook', value: '#3b5998' },
  ],
  options: {
    theme: themes.dark,
  },
})


configure(require.context('../src/stories', true, /\.stories\.js$/), module)
