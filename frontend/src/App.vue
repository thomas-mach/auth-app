<template>
  <div id="app" class="app-wrapper">
    <header class="header">header component qui</header>

    <main class="main">
      <router-view />
    </main>

    <footer class="footer">footer component qui</footer>
  </div>
</template>

<style scoped>
.app-wrapper {
  width: 100%;
  border: 1px solid red;
}

.header {
  height: 10vh;
  border: 1px solid rgb(20, 231, 168);
}

.main {
  width: 100%;
  height: 80vh;
  border: 1px solid rgb(11, 32, 221);
}

.footer {
  height: 10vh;
  border: 1px solid rgb(185, 255, 7);
}
</style>
