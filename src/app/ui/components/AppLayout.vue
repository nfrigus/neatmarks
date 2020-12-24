<template>
  <div class="layout">
    <div class="layout-header">
      <router-link v-key="1" :to="{ name: 'tabs' }" active-class="active" title="Tabs">
        <Icon>book</Icon>
      </router-link>
      <router-link v-key="2" :to="{ name: 'bookmarks' }" active-class="active" title="Bookmarks">
        <Icon>bookmark</Icon>
      </router-link>
      <router-link v-key="3" :to="{ name: 'backup' }" active-class="active" title="Backups">
        <Icon>archive</Icon>
      </router-link>
      <router-link v-key="4" :to="{ name: 'options' }" active-class="active" title="Settings">
        <Icon>cog</Icon>
      </router-link>
    </div>
    <div class="layout-content">
      <slot></slot>
    </div>
    <div class="layout-footer">
      2017-{{ new Date().getFullYear() }} &copy; NeatMarks
    </div>
  </div>
</template>

<style lang="scss">
  @import "../styles/variables";

  $height-header: 4rem;
  $height-footer: 2rem;
  $gutter: 1rem;

  body {
    min-width: 255px;
  }

  .layout {
    background: $color-bg-layout;
    display: grid;
    gap: 0;
    grid-template: "header" $height-header "main" auto "footer" $height-footer / minmax(0, 1fr);
    min-height: 100vh;
    overflow: hidden;
    place-content: stretch;
    place-items: stretch;
    position: relative;

    &-header {
      background: $color-bg-menu;
      color: $color-link;
      font-size: $height-header / 2;
      line-height: $height-header;
      list-style: none;
      margin: 0;
      padding: 0 $gutter * 2;

      a {
        display: inline-block;
        margin-right: $gutter;

        &:last-child {
          margin-right: 0;
        }
      }
    }

    &-content {
      background: $color-bg-page;
      margin: $gutter $gutter 0;
    }

    &-footer {
      text-align: center;
      line-height: $height-footer;
    }
  }
</style>
