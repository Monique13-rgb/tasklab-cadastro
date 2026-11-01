<script setup>
import { computed, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import BuscaPorIA from '../components/BuscaPorIA.vue'
import ComandosIA from '../components/ComandosIA.vue'
import Indicadores from '../components/Indicadores.vue'
import TaskForm from '../components/TaskForm.vue'
import TaskItem from '../components/TaskItem.vue'
import { useTarefasStore } from '../stores/tarefas'
import { aplicarFiltro } from '../utils/filtros'

const store = useTarefasStore()
const route = useRoute()
const router = useRouter()
const erroFormulario = ref('')
const aviso = ref('')

const busca = computed(() => (typeof route.query.busca === 'string' ? route.query.busca : ''))
const filtro = computed(() => (typeof route.query.filtro === 'string' ? route.query.filtro : 'todas'))
const tarefasFiltradas = computed(() => aplicarFiltro(store.tarefas, busca.value, filtro.value))

function atualizarQuery(chaves) {
  const query = { ...route.query, ...chaves }
  for (const [chave, valor] of Object.entries(chaves)) {
    if (valor === undefined || valor === '') delete query[chave]
  }
  return router.replace({ name: 'lista', query })
}

function atualizarBusca(valor) {
  return atualizarQuery({ busca: valor.trim() || undefined })
}

function atualizarFiltro(valor) {
  return atualizarQuery({ filtro: valor === 'todas' ? undefined : valor })
}

async function limparFiltros() {
  await atualizarQuery({ busca: undefined, filtro: undefined })
}

function adicionar(texto) {
  if (!store.adicionar(texto)) {
    erroFormulario.value = 'Não foi possível adicionar a tarefa.'
    return
  }
  erroFormulario.value = ''
  aviso.value = 'Tarefa adicionada.'
}

function alternar(tarefa) {
  store.alternar(tarefa.id)
}

function remover(tarefa) {
  if (store.remover(tarefa.id)) aviso.value = `Tarefa “${tarefa.titulo}” removida.`
}

function limparConcluidas() {
  const removidas = store.limparConcluidas()
  aviso.value = removidas ? `${removidas} tarefas concluídas removidas.` : 'Não há tarefas concluídas para remover.'
}
</script>

<template>
  <section class="page-heading">
    <div>
      <p class="eyebrow">SEU ESPAÇO DE ORGANIZAÇÃO</p>
      <h1>Minhas tarefas</h1>
      <p>Planeje, acompanhe e conclua cada etapa no seu ritmo.</p>
    </div>
    <RouterLink class="button button-quiet heading-link" :to="{ name: 'resumo', query: route.query }">
      Ver resumo
      <span aria-hidden="true">→</span>
    </RouterLink>
  </section>

  <Indicadores />

  <section class="panel add-panel" aria-labelledby="add-title">
    <div>
      <p class="eyebrow">COMECE POR AQUI</p>
      <h2 id="add-title">Adicionar uma tarefa</h2>
    </div>
    <TaskForm :erro="erroFormulario" @adicionar="adicionar" />
  </section>

  <ComandosIA />

  <section class="panel task-panel" aria-labelledby="list-title">
    <div class="section-heading task-heading">
      <div>
        <p class="eyebrow">ACOMPANHAMENTO</p>
        <h2 id="list-title">Sua lista</h2>
      </div>
      <button
        v-if="store.concluidas"
        class="button button-quiet"
        type="button"
        @click="limparConcluidas"
      >
        Limpar concluídas
      </button>
    </div>

    <div class="filters">
      <div class="filter-field">
        <label for="busca-tarefa">Buscar por título</label>
        <input
          id="busca-tarefa"
          :value="busca"
          type="search"
          placeholder="Ex.: Vue"
          @input="atualizarBusca($event.target.value)"
        >
      </div>
      <div class="filter-field">
        <label for="filtro-situacao">Situação</label>
        <select id="filtro-situacao" :value="filtro" @change="atualizarFiltro($event.target.value)">
          <option value="todas">Todas</option>
          <option value="pendentes">Pendentes</option>
          <option value="concluidas">Concluídas</option>
        </select>
      </div>
      <button class="button button-quiet clear-filters" type="button" @click="limparFiltros">
        Limpar filtros
      </button>
    </div>

    <BuscaPorIA />

    <p v-if="aviso" class="inline-status" role="status" aria-live="polite">{{ aviso }}</p>

    <div v-if="store.tarefas.length === 0" class="empty-state">
      <span class="empty-icon" aria-hidden="true">✓</span>
      <h3>Nenhuma tarefa cadastrada</h3>
      <p>Adicione uma tarefa para começar a organizar seu dia.</p>
    </div>
    <div v-else-if="tarefasFiltradas.length === 0" class="empty-state">
      <span class="empty-icon" aria-hidden="true">⌕</span>
      <h3>Nenhuma tarefa corresponde aos filtros</h3>
      <p>Experimente outro termo ou limpe os filtros para ver sua lista completa.</p>
    </div>
    <ul v-else class="task-list">
      <TaskItem
        v-for="tarefa in tarefasFiltradas"
        :key="tarefa.id"
        :tarefa="tarefa"
        @alternar="alternar"
        @remover="remover"
      />
    </ul>
  </section>
</template>
