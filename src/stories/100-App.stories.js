import { action } from '@storybook/addon-actions'
import { random } from 'lodash'
import faker from 'faker'


export default { title: 'App' }


export const layout = () => ({
  template: '<AppLayout/>',
})
export const tabsList = () => ({
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
    windows: makeArray(3).map((i) => ({
      id: i,
      tabs: makeArray(5).map((j) => ({
        favIconUrl: `https://api.adorable.io/avatars/32/${i}-${j}`,
        id: j,
        title: `Tab ${i}/${j}`,
      })),
    })),
  }),
})
export const backupsList = () => ({
  template: `<BackupsList
    :backups="backups"
    @item:action:delete="del"
    @item:action:restore="restore"
    @item:click="click"
    @item:hover="hover"
  />`,
  methods: {
    click: action('click'),
    del: action('delete'),
    hover: action('hover'),
    restore: action('restore'),
  },
  data: () => ({
    backups: makeArray(10).map(() => ({
      stats: makeRandomStats(),
      createdAt: faker.date.past(),
    })),
  }),
})

function makeRandomStats() {
  const total = random(10 ** random(6))
  const links = random(total)
  const folders = total - links

  return {
    folders,
    links,
    total,
  }
}
function makeArray(length) {
  return Array.from({ length }, (_, i) => i + 1)
}
