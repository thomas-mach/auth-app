<template>
  <div class="container">
    <CardForm>
      <template #title>
        <p>Sign in</p>
      </template>
      <template #message>
        <p>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Repudiandae,
          ducimus.
        </p>
      </template>
      <template #form>
        <form action="">
          <label for="email">Email</label>
          <input type="text" id="email" placeholder="Email Adress" />
          <label for="password">Password</label>
          <input type="text" id="password" placeholder="Enter Password" />
          <router-link to="/password-reset">Forgot Password</router-link>
          <button>SIGN IN</button>
        </form>
      </template>
      <template #footer>
        <div>
          <p>Don't Have an Account?</p>
          <router-link to="/signup">Create Account</router-link>
        </div>
      </template>
    </CardForm>
  </div>
</template>

<script setup>
import CardForm from "../components/CardForm.vue";
</script>

<style scoped>
.container {
  margin: 0 auto;
  width: 90%;
  max-width: 1024px;
  height: 100%;
  display: grid;
  place-items: center;
  border: 1px solid rgb(1, 2, 7);
}

form {
  display: flex;
  flex-direction: column;
}
</style>
