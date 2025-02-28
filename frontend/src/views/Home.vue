<template>
  <div class="wraper">
    <h1>
      This is an authentication app. Please
      <router-link to="/signup" class="link">sign up</router-link>.
    </h1>
  </div>
</template>

<script setup></script>

<style scoped>
.wraper {
  width: 90%;
  max-width: 1224px;
  margin: 0 auto;
}

h1 {
  margin-top: 3em;
  color: var(--clr-light-dark);
  font-size: var(--fs-h1);
  text-align: center;
  letter-spacing: 3px;
}

.link {
  color: var(--clr-accent);
}
</style>
