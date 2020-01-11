<template>
  <Layout class="layout">
    <Header class="layout-header">
      <Menu mode="horizontal" theme="dark" active-name="1">
        <MenuItem name="tabs">
          <router-link v-key="1" :to="{ name: 'tabs' }" active-class="active" title="Tabs">
            <Icon>book</Icon>
          </router-link>
        </MenuItem>
        <MenuItem name="bookmarks">
          <router-link v-key="2" :to="{ name: 'bookmarks' }" active-class="active" title="Bookmarks">
            <Icon>bookmark</Icon>
          </router-link>
        </MenuItem>
        <MenuItem name="backup">
          <router-link v-key="3" :to="{ name: 'backup' }" active-class="active" title="Backups">
            <Icon>archive</Icon>
          </router-link>
        </MenuItem>
        <MenuItem name="settings">
          <router-link v-key="4" :to="{ name: 'options' }" active-class="active" title="Settings">
            <Icon>cog</Icon>
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

<style lang="scss">
  html, body {
    height: 100%;
    min-width: 160px;
  }

  .layout {
    background: #f5f7f9;
    min-height: 100%;
    overflow: hidden;
    position: relative;

    &-header {
      position: fixed;
      width: 100%;
      z-index: 100;

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
