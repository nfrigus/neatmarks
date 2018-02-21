<template>
  <div class="layout">
    <Layout>
      <Header :style="{position: 'fixed', width: '100%'}">
        <Menu mode="horizontal" theme="dark" active-name="1">
          <div class="layout-logo"></div>
          <div class="layout-nav">
            <MenuItem name="1">
              <router-link active-class="active" to="/bookmarks.html">
                <Icon type="ios-keypad"></Icon>
                Bookmarks
              </router-link>
            </MenuItem>
            <MenuItem name="2">
              <router-link active-class="active" to="/options.html">
                <Icon type="ios-analytics"></Icon>
                Settings
              </router-link>
            </MenuItem>
          </div>
        </Menu>
      </Header>
      <Content class="layout-content">
        <slot></slot>
      </Content>
      <Footer class="layout-footer">2017-{{ new Date().getFullYear() }} &copy; NeatMarks</Footer>
    </Layout>
  </div>
</template>
<script>
  /**
   * todo: make footer stick to bottom
   **/
  export default {}
</script>
<style  lang="scss">
  .layout {
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    overflow: hidden;

    &-nav {
      margin: 0 20px;
      width: 420px;
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
