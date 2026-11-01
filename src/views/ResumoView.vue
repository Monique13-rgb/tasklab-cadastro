<script setup>
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import Indicadores from '../components/Indicadores.vue'
import { useTarefasStore } from '../stores/tarefas'

const store = useTarefasStore()
const route = useRoute()
const pendentes = computed(() => store.tarefas.filter((tarefa) => !tarefa.concluida))
const concluidas = computed(() => store.tarefas.filter((tarefa) => tarefa.concluida))
</script>

<template>
  <section class="page-heading">
    <div>
      <p class="eyebrow">VISÃO GERAL</p>
      <h1>Resumo</h1>
      <p>Um retrato rápido do que já foi feito e do que vem a seguir.</p>
    </div>
    <RouterLink class="button button-primary heading-link" :to="{ name: 'lista', query: { filtro: 'pendentes' } }">
      Ver só as pendentes
      <span aria-hidden="true">→</span>
    </RouterLink>
  </section>

  <Indicadores />

  <section class="panel progress-panel" aria-labelledby="progress-title">
    <div class="section-heading">
      <div>
        <p class="eyebrow">PROGRESSO</p>
        <h2 id="progress-title">Conclusão geral</h2>
      </div>
      <strong class="progress-number">{{ store.percentualConcluido }}%</strong>
    </div>
    <div
      class="progress-track"
      role="progressbar"
      :aria-valuenow="store.percentualConcluido"
      aria-valuemin="0"
      aria-valuemax="100"
      :aria-label="`${store.percentualConcluido}% das tarefas concluídas`"
    >
      <span :style="{ width: `${store.percentualConcluido}%` }"></span>
    </div>
    <p class="muted-copy">{{ store.concluidas }} de {{ store.total }} tarefas concluídas.</p>
  </section>

  <div class="summary-columns">
    <section class="panel summary-list" aria-labelledby="pending-title">
      <div class="section-heading">
        <div>
          <p class="eyebrow">PRÓXIMOS PASSOS</p>
          <h2 id="pending-title">Pendentes</h2>
        </div>
        <span class="count-badge">{{ pendentes.length }}</span>
      </div>
      <ul v-if="pendentes.length" class="compact-list">
        <li v-for="tarefa in pendentes" :key="tarefa.id">
          <RouterLink :to="{ name: 'tarefa', params: { id: tarefa.id } }">{{ tarefa.titulo }}</RouterLink>
        </li>
      </ul>
      <p v-else class="muted-copy">Tudo em dia: não há tarefas pendentes.</p>
    </section>

    <section class="panel summary-list" aria-labelledby="completed-title">
      <div class="section-heading">
        <div>
          <p class="eyebrow">CONQUISTAS</p>
          <h2 id="completed-title">Concluídas</h2>
        </div>
        <span class="count-badge count-badge-done">{{ concluidas.length }}</span>
      </div>
      <ul v-if="concluidas.length" class="compact-list">
        <li v-for="tarefa in concluidas" :key="tarefa.id">
          <RouterLink :to="{ name: 'tarefa', params: { id: tarefa.id } }">{{ tarefa.titulo }}</RouterLink>
        </li>
      </ul>
      <p v-else class="muted-copy">As tarefas que concluir aparecerão aqui.</p>
    </section>
  </div>

  <p class="back-link">
    <RouterLink :to="{ name: 'lista', query: route.query }">← Voltar para a lista</RouterLink>
  </p>
</template>
