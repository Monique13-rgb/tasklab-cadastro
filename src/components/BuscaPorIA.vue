<script setup>
import { onUnmounted, ref } from 'vue'
import { useFiltrosUrl } from '../composables/useFiltrosUrl'
import { pedirFiltro } from '../services/ia'

const { aplicar } = useFiltrosUrl()
const texto = ref('')
const carregando = ref(false)
const erro = ref('')
let controlador

async function interpretar() {
  const pedido = texto.value.trim()
  if (!pedido) {
    erro.value = 'Escreva o que deseja encontrar.'
    return
  }
  if (pedido.length > 200) {
    erro.value = 'O pedido deve ter até 200 caracteres.'
    return
  }

  controlador?.abort()
  const atual = new AbortController()
  controlador = atual
  carregando.value = true
  erro.value = ''
  try {
    const filtros = await pedirFiltro(pedido, atual.signal)
    await aplicar(filtros, { empurrar: true })
  } catch (falha) {
    if (falha.name !== 'AbortError') erro.value = 'Não foi possível interpretar o pedido. Verifique o proxy e tente novamente.'
  } finally {
    if (controlador === atual) carregando.value = false
  }
}

onUnmounted(() => controlador?.abort())
</script>

<template>
  <section class="ai-inline" aria-labelledby="filtro-ia-title">
    <div>
      <h3 id="filtro-ia-title">Filtrar com IA</h3>
      <p>Descreva o que quer encontrar; a IA preencherá os filtros da lista.</p>
    </div>
    <form class="ai-form" @submit.prevent="interpretar" novalidate>
      <label class="sr-only" for="pedido-filtro-ia">Pedido para filtrar tarefas</label>
      <input
        id="pedido-filtro-ia"
        v-model="texto"
        maxlength="200"
        placeholder="Ex.: só as pendentes sobre router"
        :disabled="carregando"
      >
      <button class="button button-secondary" type="submit" :disabled="carregando">
        {{ carregando ? 'Interpretando…' : 'Aplicar pedido' }}
      </button>
    </form>
    <p v-if="carregando" class="inline-status" role="status">Interpretando o pedido…</p>
    <p v-else-if="erro" class="inline-error" role="alert">{{ erro }}</p>
  </section>
</template>
