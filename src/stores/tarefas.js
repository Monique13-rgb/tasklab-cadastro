import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { pedirPassos } from '../services/ia'
import { lerSalvas, salvar, semente } from '../utils/armazenamento'

function novoId() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export const useTarefasStore = defineStore('tarefas', () => {
  const tarefas = ref([])
  const carregando = ref(false)
  const erro = ref('')
  const storageError = ref('')
  const mensagem = ref('')
  const sugestoes = ref([])
  const iaCarregando = ref(false)
  const iaErro = ref('')
  let controladorIA

  const total = computed(() => tarefas.value.length)
  const concluidas = computed(() => tarefas.value.filter((tarefa) => tarefa.concluida).length)
  const totalPendentes = computed(() => total.value - concluidas.value)
  const percentualConcluido = computed(() =>
    total.value === 0 ? 0 : Math.round((concluidas.value / total.value) * 100),
  )

  function persistir() {
    try {
      salvar(tarefas.value)
      storageError.value = ''
      return true
    } catch {
      storageError.value = 'As alterações estão nesta sessão, mas não puderam ser salvas neste navegador.'
      return false
    }
  }

  async function carregar() {
    carregando.value = true
    erro.value = ''
    await new Promise((resolve) => setTimeout(resolve, 120))

    try {
      const salvas = lerSalvas()
      tarefas.value = salvas ?? semente()
      if (salvas === null) persistir()
    } catch (falha) {
      tarefas.value = []
      erro.value = falha.message || 'O armazenamento local não pôde ser lido.'
    } finally {
      carregando.value = false
    }
  }

  async function tentarNovamente() {
    carregando.value = true
    erro.value = ''
    await new Promise((resolve) => setTimeout(resolve, 120))

    try {
      const salvas = lerSalvas()
      tarefas.value = salvas ?? semente()
      if (salvas === null) persistir()
      mensagem.value = 'Tarefas carregadas com sucesso.'
    } catch (falha) {
      if (!falha.message?.includes('corrompidos')) {
        erro.value = falha.message || 'O armazenamento local continua indisponível.'
        return
      }

      tarefas.value = semente()
      if (persistir()) {
        mensagem.value = 'Os dados inválidos foram substituídos pela lista inicial de tarefas.'
      }
    } finally {
      carregando.value = false
    }
  }

  function porId(id) {
    return tarefas.value.find((tarefa) => tarefa.id === String(id))
  }

  function adicionar(titulo, descricao = '') {
    const nome = typeof titulo === 'string' ? titulo.trim() : ''
    if (!nome || nome.length > 80) return null

    const tarefa = {
      id: novoId(),
      titulo: nome,
      descricao: typeof descricao === 'string' ? descricao.trim() : '',
      concluida: false,
    }
    tarefas.value.push(tarefa)
    persistir()
    return tarefa
  }

  function alternar(id) {
    const tarefa = porId(id)
    if (!tarefa) return false
    tarefa.concluida = !tarefa.concluida
    persistir()
    return true
  }

  function editar({ id, titulo, descricao }) {
    const tarefa = porId(id)
    const nome = typeof titulo === 'string' ? titulo.trim() : ''
    if (!tarefa || !nome || nome.length > 80) return false

    tarefa.titulo = nome
    if (typeof descricao === 'string') tarefa.descricao = descricao.trim()
    persistir()
    return true
  }

  function remover(id) {
    if (!porId(id)) return false
    tarefas.value = tarefas.value.filter((tarefa) => tarefa.id !== String(id))
    persistir()
    return true
  }

  function limparConcluidas() {
    const quantidade = concluidas.value
    if (quantidade === 0) return 0
    tarefas.value = tarefas.value.filter((tarefa) => !tarefa.concluida)
    persistir()
    return quantidade
  }

  async function sugerirPassos(titulo) {
    controladorIA?.abort()
    const atual = new AbortController()
    controladorIA = atual
    iaCarregando.value = true
    iaErro.value = ''
    sugestoes.value = []

    try {
      sugestoes.value = await pedirPassos(titulo, atual.signal)
      if (sugestoes.value.length === 0) iaErro.value = 'Nenhum passo válido foi recebido.'
    } catch (falha) {
      if (falha.name !== 'AbortError') iaErro.value = 'Não foi possível obter sugestões. Verifique se o proxy está ativo e tente novamente.'
    } finally {
      if (controladorIA === atual) iaCarregando.value = false
    }
  }

  function limparSugestoes() {
    controladorIA?.abort()
    controladorIA = undefined
    sugestoes.value = []
    iaErro.value = ''
    iaCarregando.value = false
  }

  function aceitarSugestao(passo) {
    const tarefa = adicionar(passo)
    if (!tarefa) return false
    sugestoes.value = sugestoes.value.filter((sugestao) => sugestao !== passo)
    return true
  }

  function aceitarTodas() {
    const passos = [...sugestoes.value]
    let adicionadas = 0
    for (const passo of passos) {
      if (adicionar(passo)) adicionadas += 1
    }
    sugestoes.value = []
    iaErro.value = ''
    mensagem.value = `${adicionadas} ${adicionadas === 1 ? 'tarefa adicionada' : 'tarefas adicionadas'} a partir das sugestões.`
    return adicionadas
  }

  return {
    tarefas,
    carregando,
    erro,
    storageError,
    mensagem,
    sugestoes,
    iaCarregando,
    iaErro,
    total,
    concluidas,
    totalPendentes,
    percentualConcluido,
    porId,
    carregar,
    tentarNovamente,
    adicionar,
    alternar,
    editar,
    remover,
    limparConcluidas,
    sugerirPassos,
    limparSugestoes,
    aceitarSugestao,
    aceitarTodas,
  }
})
