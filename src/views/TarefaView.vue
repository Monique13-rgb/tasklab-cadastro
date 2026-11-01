<script setup>
import { computed, ref, watch } from 'vue'
import { onBeforeRouteLeave, onBeforeRouteUpdate, RouterLink, useRouter } from 'vue-router'
import PassosSugeridos from '../components/PassosSugeridos.vue'
import { useTarefasStore } from '../stores/tarefas'

const props = defineProps({
  id: { type: String, required: true },
})

const store = useTarefasStore()
const router = useRouter()
const tarefa = computed(() => store.porId(props.id))
const titulo = ref('')
const descricao = ref('')
const erro = ref('')
const aviso = ref('')
const sujo = computed(
  () => Boolean(tarefa.value) &&
    (titulo.value.trim() !== tarefa.value.titulo || descricao.value.trim() !== tarefa.value.descricao),
)

function restaurarRascunho() {
  titulo.value = tarefa.value?.titulo ?? ''
  descricao.value = tarefa.value?.descricao ?? ''
  erro.value = ''
}

watch(() => props.id, restaurarRascunho, { immediate: true })
watch(() => tarefa.value?.titulo, (valor) => {
  if (!sujo.value) titulo.value = valor ?? ''
})

function confirmarSaida() {
  if (!sujo.value) return true
  return window.confirm('Há alterações não salvas. Deseja sair sem salvar?')
}

onBeforeRouteLeave(confirmarSaida)
onBeforeRouteUpdate((to, from) => {
  if (to.params.id === from.params.id) return true
  return confirmarSaida()
})

function salvarEdicao() {
  const nome = titulo.value.trim()
  if (!nome) {
    erro.value = 'O título da tarefa não pode ficar vazio.'
    return
  }
  if (nome.length > 80) {
    erro.value = 'O título deve ter até 80 caracteres.'
    return
  }
  if (!store.editar({ id: props.id, titulo: nome, descricao: descricao.value })) {
    erro.value = 'Não foi possível salvar. Verifique se a tarefa ainda existe.'
    return
  }
  erro.value = ''
  aviso.value = 'Alterações salvas.'
}

function cancelarEdicao() {
  restaurarRascunho()
  aviso.value = 'Rascunho descartado.'
}

async function removerTarefa() {
  if (!tarefa.value) return
  if (sujo.value && !window.confirm('Há alterações não salvas. Deseja remover a tarefa e sair?')) return
  store.remover(props.id)
  await router.push({ name: 'lista' })
}
</script>

<template>
  <section v-if="tarefa" class="page-heading">
    <div>
      <p class="eyebrow">DETALHES DA TAREFA</p>
      <h1>{{ tarefa.titulo }}</h1>
      <p>Edite os detalhes; suas alterações só serão aplicadas ao salvar.</p>
    </div>
    <RouterLink class="button button-quiet heading-link" :to="{ name: 'lista' }">← Voltar à lista</RouterLink>
  </section>

  <section v-if="tarefa" class="panel detail-panel">
    <form class="detail-form" @submit.prevent="salvarEdicao" novalidate>
      <div class="filter-field">
        <label for="titulo-edicao">Título</label>
        <input id="titulo-edicao" v-model="titulo" maxlength="80" aria-describedby="erro-edicao">
      </div>
      <div class="filter-field">
        <label for="descricao-edicao">Descrição</label>
        <textarea id="descricao-edicao" v-model="descricao" rows="4" maxlength="500"></textarea>
      </div>
      <p class="detail-status">
        Situação:
        <span class="status-pill" :class="tarefa.concluida ? 'status-done' : 'status-pending'">
          {{ tarefa.concluida ? 'Concluída' : 'Pendente' }}
        </span>
      </p>
      <p v-if="erro" id="erro-edicao" class="inline-error" role="alert">{{ erro }}</p>
      <p v-else id="erro-edicao" class="sr-only"></p>
      <p v-if="aviso" class="inline-status" role="status">{{ aviso }}</p>
      <div class="detail-actions">
        <button class="button button-primary" type="submit" :disabled="!sujo">Salvar alterações</button>
        <button class="button button-quiet" type="button" :disabled="!sujo" @click="cancelarEdicao">
          Cancelar
        </button>
        <button class="button button-danger" type="button" @click="removerTarefa">Remover tarefa</button>
      </div>
    </form>
  </section>

  <PassosSugeridos v-if="tarefa" :titulo="tarefa.titulo" />

  <section v-if="!tarefa" class="panel state-card">
    <p class="eyebrow">404</p>
    <h1>Tarefa não encontrada</h1>
    <p>Ela pode ter sido removida ou o endereço está incorreto.</p>
    <RouterLink class="button button-primary" :to="{ name: 'lista' }">Voltar para as tarefas</RouterLink>
  </section>
</template>
