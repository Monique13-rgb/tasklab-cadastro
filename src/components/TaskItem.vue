<script setup>
import { RouterLink } from 'vue-router'

defineProps({
  tarefa: { type: Object, required: true },
})

const emit = defineEmits(['alternar', 'remover'])
</script>

<template>
  <li class="task-row" :class="{ 'task-row-done': tarefa.concluida }">
    <button
      class="check-button"
      type="button"
      :aria-label="tarefa.concluida ? `Reabrir ${tarefa.titulo}` : `Concluir ${tarefa.titulo}`"
      :aria-pressed="tarefa.concluida"
      @click="emit('alternar', tarefa)"
    >
      <span aria-hidden="true">{{ tarefa.concluida ? '✓' : '' }}</span>
    </button>
    <div class="task-main">
      <RouterLink class="task-title" :to="{ name: 'tarefa', params: { id: tarefa.id } }">
        {{ tarefa.titulo }}
      </RouterLink>
      <p v-if="tarefa.descricao" class="task-description">{{ tarefa.descricao }}</p>
      <span class="status-pill" :class="tarefa.concluida ? 'status-done' : 'status-pending'">
        {{ tarefa.concluida ? 'Concluída' : 'Pendente' }}
      </span>
    </div>
    <div class="task-actions">
      <RouterLink class="text-link" :to="{ name: 'tarefa', params: { id: tarefa.id } }">Detalhes</RouterLink>
      <button class="icon-action danger-text" type="button" @click="emit('remover', tarefa)">
        Remover
      </button>
    </div>
  </li>
</template>
