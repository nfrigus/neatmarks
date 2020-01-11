<template>
  <ul class="BackupsList">
    <li
      v-for="(backup, index) in backups"
      :key="index"
      class="BackupsList-Row"
      @click.prevent="click(backup)"
      @mouseover="hover(backup)"
    >
      <div>{{ index + 1 }}</div>
      <div>
        {{ getDate(backup.createdAt) }}
        <br />
        {{ getTime(backup.createdAt) }}
      </div>
      <div>
        <BMStats :stats="backup.stats" />
      </div>
      <div class="BackupsList-Actions">
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
    props: {
      backups: { required: true, type: Array },
    },
    methods: {
      action,
      click,
      getDate(date) { return date.toISOString().slice(0, 10) },
      getTime(date) { return date.toISOString().slice(11, 19) },
      hover,
    },
  }
</script>

<style lang="scss">
  .BackupsList {
    border-spacing: 0 1px;
    display: table;
    text-align: center;

    &-Row {
      display: table-row;

      > div {
        display: table-cell;
        padding: 0 .5em;
        vertical-align: middle;
      }

      &:hover {
        background: rgba(0, 0, 0, 0.3);
      }
    }

    &-Actions {
      font-size: 2em;
    }
  }
</style>
