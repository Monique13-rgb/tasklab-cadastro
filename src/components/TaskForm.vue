<script setup>
import { ref } from 'vue'

defineProps({
  erro: { type: String, default: '' },
})

const emit = defineEmits(['adicionar'])
const titulo = ref('')
const erroLocal = ref('')

function enviar() {
  const texto = titulo.value.trim()
  if (!texto) {
    erroLocal.value = 'Informe um título para a tarefa.'
    return
  }
  if (texto.length > 80) {
    erroLocal.value = 'O título deve ter até 80 caracteres.'
    return
  }

  emit('adicionar', texto)
  titulo.value = ''
  erroLocal.value = ''
}
</script>

<template>
  <form class="add-form" @submit.prevent="enviar" novalidate>
    <label class="sr-only" for="nova-tarefa">Título da nova tarefa</label>
    <input
      id="nova-tarefa"
      v-model="titulo"
      maxlength="80"
      placeholder="Ex.: Revisar o conteúdo de Vue"
      aria-describedby="erro-tarefa"
    >
    <button class="button button-primary" type="submit">Adicionar tarefa</button>
  </form>
  <p v-if="erro || erroLocal" id="erro-tarefa" class="inline-error" role="alert">
    {{ erro || erroLocal }}
  </p>
  <p v-else id="erro-tarefa" class="sr-only"></p>
</template>
