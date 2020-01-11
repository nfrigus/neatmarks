<script>
  export default {
    name: 'Icon',
    render() {
      return <i class={{ fa: 1, fas: 1, [`fa-${this.$slots.default[0].text}`]: 1 }}></i>
    },
  }
</script>
