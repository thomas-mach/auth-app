<template>
  <div id="app" class="app-wrapper">
    <div class="stars">
      <header class="header">
        <Header />
      </header>

      <main class="main">
        <router-view />
      </main>

      <footer class="footer">
        <img
          class="hills"
          src="../images/pattern-hills.svg"
          alt="pattern-hills"
        />
      </footer>
    </div>
  </div>
</template>

<script setup>
import Header from "./components/Header.vue";
</script>

<style scoped>
.app-wrapper {
  width: 100%;
  background: linear-gradient(#1d1e28, #261a2d);
  /* border: 1px solid rgb(144, 234, 0); */
}

.stars {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-image: url(images/bg-stars.svg);
  height: 100%;
}

.header {
  margin: 0 auto;
  width: 100%;
  /* border: 1px solid rgb(190, 22, 22); */
}

.main {
  width: 100%;
  flex-grow: 1;
  z-index: 200;
  /* border: 1px solid rgb(11, 32, 221); */
}

.footer {
  width: 100%;
  position: fixed;
  bottom: 0;
}

.hills {
  transform: translateX(-20%);
}

@media (min-width: 1430px) {
  .hills {
    transform: translateX(0%);
    width: 100%;
  }
}

@media (min-width: 1140px) {
  .hills {
    transform: translateX(0%);
  }
}
</style>
