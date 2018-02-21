<template>
  <Layout class="layout">
    <Header class="layout-header">
      <Menu mode="horizontal" theme="dark" active-name="1">
        <MenuItem name="tabs">
          <router-link active-class="active" title="Tabs" to="/tabs.html">
            <Icon type="ios-book"></Icon>
          </router-link>
        </MenuItem>
        <MenuItem name="bookmarks">
          <router-link active-class="active" title="Bookmarks" to="/bookmarks.html">
            <Icon type="bookmark"></Icon>
          </router-link>
        </MenuItem>
        <MenuItem name="settings">
          <router-link active-class="active" title="Settings" to="/options.html">
            <Icon type="erlenmeyer-flask"></Icon>
          </router-link>
        </MenuItem>
      </Menu>
    </Header>
    <Content class="layout-content">
      <slot></slot>
    </Content>
    <Footer class="layout-footer">2017-{{ new Date().getFullYear() }} &copy; NeatMarks</Footer>
  </Layout>
</template>
<script>
  /**
   * todo: make footer stick to bottom
   **/
  export default {}
</script>
<style lang="scss">
  .layout {
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    overflow: hidden;

    &-header {
      position: fixed;
      width: 100%;
      .ivu-menu-item {
        font-size: 1.5em;
      }
    }

    &-logo {
      width: 2em;
      height: 2em;
      background: #f00 url("/icons/icon.svg");
    }

    &-nav {
      font-size: 1.5em;
    }

    &-content {
      background: #fff;
      margin: 88px 20px 0;
      min-height: 500px;
    }

    &-footer {
      text-align: center;
    }
  }
</style>
