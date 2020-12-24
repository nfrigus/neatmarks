import { action } from '@storybook/addon-actions'
import { random } from 'lodash'
import faker from 'faker'

export default { title: 'App' }

export const layout = () => ({
  template: '<AppLayout/>',
})
export const tabs = () => ({
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
  data: mockTabsData,
})
export const backups = () => ({
  template: `<BackupsList
    :backups="backups"
    :stats="stats"
    @item:action:backup="backup"
    @item:action:delete="del"
    @item:action:restore="restore"
    @item:click="click"
    @item:hover="hover"
  />`,
  methods: {
    backup: action('backup'),
    click: action('click'),
    del: action('delete'),
    hover: action('hover'),
    restore: action('restore'),
  },
  data: mockBackupsData,
})
export const bookmarks = () => ({
  template: `<BMTree
    :nodes="nodes"
    @bookmark:remove="remove"
    @bookmark:restore="restore"
  />`,
  methods: {
    remove: action('remove'),
    restore: action('restore'),
  },
  data: () => ({
    nodes: range(30).map(() => mockBMNode(1)).sort(foldersFirst),
  }),
})

function mockBMNode(depth) {
  const children = random(0, 10) ? undefined : range(random(0, 10)).map(() => mockBMNode(depth + 1))
  if (children) {
    children.sort(foldersFirst)
  }

  return {
    children,
    collapsed: false,
    dateAdded: faker.date.past(),
    id: faker.random.number(),
    isDeleted: !random(0, 3),
    title: faker.random.words(),
    url: children ? undefined : faker.internet.url(),
  }
}

function foldersFirst(a, b) {
  return isDir(b) - isDir(a)

  function isDir(node) {
    return !node.url
  }
}

function mockTabsData() {
  return {
    windows: range(3).map((i) => ({
      id: i,
      tabs: range(5).map((j) => ({
        favIconUrl: `https://api.adorable.io/avatars/32/${i}-${j}`,
        id: j,
        title: `Tab ${i}/${j}`,
      })),
    })),
  }
}

function mockBackupsData() {
  return {
    backups: range(10).map(() => ({
      stats: makeRandomStats(),
      createdAt: faker.date.past(),
    })),
    stats: makeRandomStats(),
  }
}

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
function range(length) {
  return Array.from({ length }, (_, i) => i + 1)
}
