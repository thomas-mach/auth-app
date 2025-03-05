<template>
  <div class="wrapper">
    <h2>DASHBOARD</h2>
    <nav>
      <ul>
        <li>
          <router-link to="/dash-board/name-change" class="custom-link"
            >Change name</router-link
          >
        </li>
        <li>
          <router-link to="/dash-board/password-change" class="custom-link"
            >Change password</router-link
          >
        </li>
        <li>
          <router-link to="/dash-board/delete-account" class="custom-link"
            >Delete account</router-link
          >
        </li>
      </ul>
    </nav>
    <router-view />
  </div>
</template>

<script setup></script>

<style scoped>
.wrapper {
  width: 90%;
  max-width: 1224px;
  margin: 0 auto;
}

h2 {
  color: var(--clr-light);
  text-align: center;
  margin: 1em 0;
}

.custom-link {
  color: var(--clr-light);
  font-weight: var(--fw-bold);
}

ul {
  list-style: none;
}

@media (min-width: 768px) {
  .custom-link:hover {
    color: var(--clr-accent);
  }
}
</style>
