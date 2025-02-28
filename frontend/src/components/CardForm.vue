<template>
  <div class="card">
    <div class="card-title">
      <slot name="title"></slot>
    </div>
    <div class="card-message">
      <slot name="message"></slot>
    </div>
    <div class="card-form">
      <slot name="form"></slot>
    </div>
    <div class="card-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup></script>

<style scoped>
.card {
  background-color: var(--clr-light);
  width: 100%;
  max-width: 600px;
  border-radius: 20px;
  padding: 2em;
  margin-top: 4em;
  display: flex;
  flex-direction: column;
  box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.1);
}

.card-title {
  font-size: var(--fs-h1);
  font-weight: var(--fw-bold);
  color: var(--clr-dark);
}

.card-message {
  font-size: var(--fs-body);
  color: var(--clr-dark-light);
}

@media (min-width: 600px) {
  .card {
    min-width: 480px;
  }
}
</style>
