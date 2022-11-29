<template>
  <div class="BackupsList">
    <div class="BackupsList-Header">
      <div>
        <BmStats :stats="stats" />
      </div>
      <div>
        <a @click="action('backup')">
          <Icon>save</Icon>
        </a>
      </div>
    </div>
    <ul class="BackupsList-Table">
      <li
        v-for="(backup, index) in backups"
        :key="index"
        class="BackupsList-Row"
        @click.prevent="click(backup)"
        @mouseover="hover(backup)"
      >
        <div>{{ index as number + 1 }}</div>
        <div>
          {{ getDate(backup.createdAt) }}
          <br />
          {{ getTime(backup.createdAt) }}
        </div>
        <div>
          <BmStats :stats="backup.stats" />
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
  </div>
</template>

<script lang="ts">
  const confirmMessages = {
    delete: 'Are you sure you want to remove backup?',
    restore: 'This action will create backup and replace all existing bookmarks. Proceed?',
  }

  export default {
    props: {
      backups: { required: true, type: Array },
      stats: { required: true, type: Object },
    },
    methods: {
      action,
      click,
      getDate(date) { return date.toISOString().slice(0, 10) },
      getTime(date) { return date.toISOString().slice(11, 19) },
      hover,
    },
  }

  function action(type, item) {
    const confirmMessage = confirmMessages[type]

    if (confirmMessage && !window.confirm(confirmMessage)) return;

    this.$emit(`item:action:${type}`, item)
  }
  function hover(item) {
    this.$emit('item:hover', item)
  }
  function click(item) {
    this.$emit('item:click', item)
  }
</script>

<style lang="scss">
  .BackupsList {
    &-Header {
      display: table;
      border-spacing: 1em;

      > div {
        display: table-cell;
        vertical-align: middle;
      }

      a {
        font-size: 2em;
      }
    }

    &-Table {
      border-spacing: 0 1px;
      display: table;
      text-align: center;
    }

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
