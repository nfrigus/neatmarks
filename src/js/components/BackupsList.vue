<template>
  <ul class="BackupsList">
    <li
      v-for="(backup, index) in backups"
      :key="index"
      class="BackupsList-Item"
      @click.prevent="click(backup)"
      @mouseover="hover(backup)"
    >
      <div>{{ index + 1 }}</div>
      <div>{{ backup.createdAt.toISOString() }}</div>
      <div class="number">{{ backup.stats.folders }}</div>
      <div class="number">{{ backup.stats.links }}</div>
      <div class="number">{{ backup.stats.total }}</div>
      <div>
        <a @click.stop="action('restore', backup)">
          <Icon>share-square</Icon>
        </a>
        <a @click.stop="action('delete', backup)">
          <Icon>trash</Icon>
        </a>
      </div>
    </li>
  </ul>
</template>

<script>
  import Icon from './Icon.vue'

  function action(type, item) {
    this.$emit(`item:action:${type}`, item)
  }
  function hover(item) {
    this.$emit('item:hover', item)
  }
  function click(item) {
    this.$emit('item:click', item)
  }

  export default {
    components: { Icon },
    props: {
      backups: { required: true, type: Array },
    },
    methods: {
      action,
      click,
      hover,
    },
  }
</script>

<style lang="scss">
  .BackupsList {
    display: table;

    &-Item {
      display: table-row;

      > div {
        display: table-cell;
        padding: 0 .5em;

        &.number {
          text-align: right;
        }
      }

      &:hover {
        background: rgba(0, 0, 0, 0.3);
      }
    }
  }
</style>
