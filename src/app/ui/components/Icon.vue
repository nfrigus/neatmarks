<template>
  <i :class="getClassNames()" />
</template>
<script lang="ts">
  export default {
    name: 'Icon',
    methods: {
      getClassNames() {
        return {
          [`fa-${this.$slots.default[0].text.trim()}`]: 1,
          fa: 1,
          fas: 1,
        }
      },
    },
  }
</script>
