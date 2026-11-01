<script setup>
import { onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useTarefasStore } from '../stores/tarefas'
import { pedirAcoes } from '../services/ia'
import { descreverAcao } from '../utils/acoes'
import { useFiltrosUrl } from '../composables/useFiltrosUrl'

const store = useTarefasStore()
const router = useRouter()
const { aplicar } = useFiltrosUrl()
const texto = ref('')
const plano = ref([])
const carregando = ref(false)
const erro = ref('')
const mensagem = ref('')
let controlador

async function pedir() {
  const pedido = texto.value.trim()
  if (!pedido) {
    erro.value = 'Escreva o que deseja fazer.'
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
  mensagem.value = ''
  plano.value = []
  try {
    plano.value = await pedirAcoes(pedido, store.tarefas, atual.signal)
    if (plano.value.length === 0) {
      erro.value = 'Não encontrei ações permitidas para esse pedido. Nenhuma tarefa foi alterada.'
    }
  } catch (falha) {
    if (falha.name !== 'AbortError') {
      erro.value = 'Não foi possível criar um plano. Verifique se o proxy está ativo e tente novamente.'
    }
  } finally {
    if (controlador === atual) carregando.value = false
  }
}

async function executar(acoes) {
  const navegacoes = []
  for (const acao of acoes) {
    let executada = true
    if (acao.acao === 'adicionar') {
      executada = Boolean(store.adicionar(acao.titulo))
    } else if (acao.acao === 'alternar') {
      executada = store.alternar(acao.id)
    } else if (acao.acao === 'editar') {
      executada = store.editar({ id: acao.id, titulo: acao.titulo })
      if (executada) navegacoes.push({ name: 'tarefa', params: { id: acao.id } })
    } else if (acao.acao === 'filtrar') {
      navegacoes.push({ name: 'lista', query: { busca: acao.busca || undefined, filtro: acao.filtro === 'todas' ? undefined : acao.filtro } })
    }

    if (!executada) {
      erro.value = 'Uma ação do plano não pôde ser executada porque a tarefa não existe mais.'
      plano.value = []
      return
    }
  }

  plano.value = plano.value.filter((acao) => !acoes.includes(acao))
  mensagem.value = `${acoes.length} ${acoes.length === 1 ? 'ação aprovada' : 'ações aprovadas'}.`
  const destino = navegacoes.at(-1)
  if (destino?.name === 'lista') await aplicar(destino.query, { empurrar: true })
  else if (destino) await router.push(destino)
}

function fazerUma(acao) {
  return executar([acao])
}

function fazerTodas() {
  return executar([...plano.value])
}

function descartar() {
  plano.value = []
  erro.value = ''
  mensagem.value = 'Plano descartado. Nenhuma tarefa foi alterada.'
}

onUnmounted(() => controlador?.abort())
</script>

<template>
  <section class="panel ai-panel" aria-labelledby="assistant-title">
    <div class="section-heading">
      <div>
        <p class="eyebrow">MODO SIMULADO</p>
        <h2 id="assistant-title">Assistente de tarefas</h2>
        <p>Peça uma ação em português. Você revisa e aprova o plano antes de qualquer alteração.</p>
      </div>
      <span class="ai-badge" aria-hidden="true">IA</span>
    </div>

    <form class="assistant-form" @submit.prevent="pedir" novalidate>
      <label for="comando-ia">O que você quer fazer?</label>
      <div class="input-action">
        <input
          id="comando-ia"
          v-model="texto"
          maxlength="200"
          placeholder="Ex.: adicione revisar o router e mostre as pendentes"
          :disabled="carregando"
        >
        <button class="button button-primary" type="submit" :disabled="carregando">
          {{ carregando ? 'Pensando…' : 'Criar plano' }}
        </button>
      </div>
    </form>

    <p v-if="carregando" class="inline-status" role="status">A IA está preparando uma proposta…</p>
    <p v-else-if="erro" class="inline-error" role="alert">{{ erro }}</p>
    <p v-if="mensagem" class="inline-status" role="status">{{ mensagem }}</p>

    <div v-if="plano.length" class="approval-box">
      <p class="approval-title">Plano proposto — ainda não executado:</p>
      <ol class="plan-list">
        <li v-for="(acao, indice) in plano" :key="`${acao.acao}-${acao.id ?? acao.titulo ?? indice}-${indice}`">
          <span>{{ descreverAcao(acao, store.tarefas) }}</span>
          <button class="button button-small button-secondary" type="button" @click="fazerUma(acao)">
            Fazer
          </button>
        </li>
      </ol>
      <div class="approval-actions">
        <button class="button button-primary" type="button" @click="fazerTodas">Fazer tudo</button>
        <button class="button button-quiet" type="button" @click="descartar">Descartar</button>
      </div>
    </div>
  </section>
</template>
