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
  max-width: 600px;
  border-radius: 20px;
  padding: 2em;
  display: flex;
  flex-direction: column;
  gap: 1em;
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
</style>
