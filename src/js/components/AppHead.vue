<template>
  <header>
    <nav class="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
      <router-link class="navbar-brand" to="/bookmarks.html">Neatmarks</router-link>
      <button
        class="navbar-toggler d-lg-none"
        data-target="#header-navbar"
        data-toggle="collapse"
        type="button"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="header-navbar">
        <ul class="navbar-nav mr-auto">
          <router-link active-class="active" tag="li" class="nav-item" to="/bookmarks.html">
            <a class="nav-link">Home</a>
          </router-link>
          <router-link active-class="active" tag="li" class="nav-item" to="/options.html">
            <a class="nav-link">Settings</a>
          </router-link>
        </ul>
        <form class="form-inline mt-2 mt-md-0" style="display: none">
          <input class="form-control mr-sm-2" type="text" placeholder="Search">
          <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
        </form>
      </div>
    </nav>
  </header>
</template>
