<template>
  <div :title="title" class="BMStats">
    <div class="BMStats-folders">{{ format(stats.folders) }}</div>
    <div class="BMStats-links">{{ format(stats.links) }}</div>
    <div class="BMStats-total">{{ format(stats.total) }}</div>
  </div>
</template>

<script>
  export default {
    name: 'BMStats',
    props: {
      stats: { required: true, type: Object },
    },
    computed: {
      title() {
        return [
          `Folders: ${this.stats.folders}`,
          `Links: ${this.stats.links}`,
          `Total: ${this.stats.total}`,
        ].join('\n')
      },
    },
    methods: { format },
  }

  function format(number) {
    if (number < 1e3) {
      return number.toFixed(0)
    }
    if (number < 1e6) {
      return `${(number / 1e3).toFixed(0)}k`
    }
    if (number < 1e9) {
      return `${(number / 1e3).toFixed(0)}M`
    }

    return '>9k'
  }
</script>

<style lang="scss">
  .BMStats {
    display: inline-flex;
    text-align: right;

    $b: 2px;

    > * {
      padding-right: 3px;
      width: 3em;
    }

    &-folders {
      border-color: #0090ff;
      border-style: groove;
      border-width: $b 0;
    }

    &-links {
      border-color: #6d00ff;
      border-style: groove;
      border-width: $b 0;
    }

    &-total {
      border-color: #00f;
      border-style: groove;
      border-width: $b 0;
    }
  }
</style>
