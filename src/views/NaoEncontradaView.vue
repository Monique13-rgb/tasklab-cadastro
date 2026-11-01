<template>
  <section class="panel state-card">
    <p class="eyebrow">ERRO 404</p>
    <h1>Esta página não existe</h1>
    <p>Confira o endereço ou volte para a lista de tarefas.</p>
    <RouterLink class="button button-primary" :to="{ name: 'lista' }">Ir para tarefas</RouterLink>
  </section>
</template>
