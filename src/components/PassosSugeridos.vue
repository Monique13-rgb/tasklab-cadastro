<script setup>
import { onUnmounted, watch } from 'vue'
import { useTarefasStore } from '../stores/tarefas'

const props = defineProps({
  titulo: { type: String, required: true },
})

const store = useTarefasStore()

watch(() => props.titulo, () => store.limparSugestoes())
onUnmounted(() => store.limparSugestoes())
</script>

<template>
  <section class="panel suggestions-panel" aria-labelledby="suggestions-title">
    <div class="section-heading">
      <div>
        <p class="eyebrow">IDEIAS EM PASSOS</p>
        <h2 id="suggestions-title">Sugestões com IA</h2>
      </div>
      <button
        v-if="!store.sugestoes.length"
        class="button button-secondary"
        type="button"
        :disabled="store.iaCarregando"
        @click="store.sugerirPassos(titulo)"
      >
        {{ store.iaCarregando ? 'Gerando…' : 'Quebrar em passos' }}
      </button>
    </div>

    <p v-if="store.iaCarregando" role="status">Preparando sugestões…</p>
    <div v-else-if="store.iaErro" class="suggestion-error">
      <p class="inline-error" role="alert">{{ store.iaErro }}</p>
      <button
        class="button button-small button-secondary"
        type="button"
        @click="store.sugerirPassos(titulo)"
      >
        Tentar novamente
      </button>
    </div>
    <div v-else-if="store.sugestoes.length">
      <p class="muted-copy">As sugestões só viram tarefas quando você as aceita.</p>
      <ul class="suggestion-list">
        <li v-for="passo in store.sugestoes" :key="passo">
          <span>{{ passo }}</span>
          <button class="button button-small button-secondary" type="button" @click="store.aceitarSugestao(passo)">
            Adicionar
          </button>
        </li>
      </ul>
      <button class="button button-primary" type="button" @click="store.aceitarTodas">
        Adicionar todos ({{ store.sugestoes.length }})
      </button>
    </div>
    <p v-else class="muted-copy">Peça passos curtos para transformar esta tarefa em ações menores.</p>
  </section>
</template>
