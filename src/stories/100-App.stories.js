/*eslint-disable*/
import { action } from '@storybook/addon-actions'
import AppLayout from '../js/components/AppLayout.vue'
import TabsList from '../js/components/TabsList.vue'

export default { title: 'App' }

export const layout = () => ({
  components: { AppLayout },
  template: '<AppLayout/>',
})
export const tabsList = () => ({
  components: { TabsList },
  template: `<TabsList
    :windows="windows"
    @tab:click="tabClick"
    @tab:close="tabClose"
    @tab:hover="tabHover"
    @window:close="windowClose"
  />`,
  methods: {
    tabClick: action('tab.click'),
    tabClose: action('tab.close'),
    tabHover: action('tab.hover'),
    windowClose: action('window.close'),
  },
  data: () => ({
    windows: [{
      id: 1,
      tabs: [
        { id: 1, favIconUrl: 'https://api.adorable.io/avatars/32/1', title: 'Tab 1' },
        { id: 2, favIconUrl: 'https://api.adorable.io/avatars/32/2', title: 'Tab 2' },
        { id: 3, favIconUrl: 'https://api.adorable.io/avatars/32/3', title: 'Tab 3' },
        { id: 4, favIconUrl: 'https://api.adorable.io/avatars/32/4', title: 'Tab 4' },
        { id: 5, favIconUrl: 'https://api.adorable.io/avatars/32/5', title: 'Tab 5' },
      ],
    }],
  }),
})
