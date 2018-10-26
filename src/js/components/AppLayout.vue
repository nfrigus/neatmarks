<template>
  <Layout class="layout">
    <Header class="layout-header">
      <Menu mode="horizontal" theme="dark" active-name="1">
        <MenuItem name="tabs">
          <router-link active-class="active" title="Tabs" :to="{ name: 'tabs' }">
            <Icon type="ios-book"></Icon>
          </router-link>
        </MenuItem>
        <MenuItem name="bookmarks">
          <router-link active-class="active" title="Bookmarks" :to="{ name: 'bookmarks' }">
            <Icon type="bookmark"></Icon>
          </router-link>


        </MenuItem>


        <MenuItem name="settings">
          <router-link active-class="active" title="Settings" :to="{ name: 'options' }">
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
  export default {}
</script>
<style lang="scss">
  html, body {
    height: 100%;
    min-width: 160px;
  }

  .layout {
    background: #f5f7f9;
    border-radius: 4px;
    border: 1px solid #d7dde4;
    min-height: 100%;
    overflow: hidden;
    position: relative;

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
