<script setup>
import { useTarefasStore } from '../stores/tarefas'

const store = useTarefasStore()
</script>

<template>
  <section class="stats-grid" aria-label="Indicadores das tarefas">
    <article class="stat-card">
      <span class="stat-label">Total</span>
      <strong class="stat-value">{{ store.total }}</strong>
      <span class="stat-caption">tarefas cadastradas</span>
    </article>
    <article class="stat-card">
      <span class="stat-label">Pendentes</span>
      <strong class="stat-value">{{ store.totalPendentes }}</strong>
      <span class="stat-caption">próximos passos</span>
    </article>
    <article class="stat-card">
      <span class="stat-label">Concluídas</span>
      <strong class="stat-value">{{ store.concluidas }}</strong>
      <span class="stat-caption">{{ store.percentualConcluido }}% do total</span>
    </article>
  </section>
</template>
