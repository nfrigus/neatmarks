import { action } from '@storybook/addon-actions'
import { app } from '@storybook/vue3'
import { themes } from '@storybook/theming'
import { UiPlugin } from '../src/app/ui'


app.use(UiPlugin)
app.component('router-link', {
  template: '<a @click="onClick"><slot></slot></a>',
  methods: {
    onClick() { action(`router-link.click`)(this.$attrs) },
  },
})


export const parameters = {
  backgrounds: {
    default: 'white',
    values: [
      {
        name: 'white',
        value: '#fff',
      },
      {
        name: 'gray',
        value: '#ccc',
      },
    ],
  },
  docs: {
    theme: themes.dark,
  },
}
