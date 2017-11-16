<template>
  <header>
    <nav class="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
      <a class="navbar-brand" href="/bookmarks.html">Neatmarks</a>
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
          <li class="nav-item active">
            <a class="nav-link" href="/bookmarks.html">Home</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/options.html">Settings</a>
          </li>
        </ul>
        <form class="form-inline mt-2 mt-md-0" style="display: none">
          <input class="form-control mr-sm-2" type="text" placeholder="Search">
          <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
        </form>
      </div>
    </nav>
  </header>
</template>
