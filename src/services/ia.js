import { validarAcoes } from '../utils/acoes'
import { validarFiltroIA } from '../utils/filtros'

async function post(url, corpo, signal) {
  const resposta = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(corpo),
    signal,
  })

  if (!resposta.ok) {
    throw new Error(`O proxy respondeu com status ${resposta.status}.`)
  }

  return resposta.json()
}

export async function pedirPassos(tarefa, signal) {
  const dados = await post('/api/quebrar', { tarefa }, signal)
  if (!Array.isArray(dados.passos)) throw new Error('Resposta inválida do proxy.')

  const passos = []
  const vistos = new Set()
  for (const passo of dados.passos) {
    if (typeof passo !== 'string') continue
    const texto = passo.trim().slice(0, 80)
    const chave = texto.toLocaleLowerCase('pt-BR')
    if (!texto || vistos.has(chave)) continue
    vistos.add(chave)
    passos.push(texto)
    if (passos.length === 5) break
  }
  return passos
}

export async function pedirFiltro(texto, signal) {
  const dados = await post('/api/filtrar', { texto }, signal)
  return validarFiltroIA(dados)
}

export async function pedirAcoes(texto, tarefas, signal) {
  const resumoTarefas = tarefas
    .slice(0, 30)
    .map(({ id, titulo, concluida }) => ({ id: String(id), titulo, concluida }))
  const dados = await post('/api/agir', { texto, tarefas: resumoTarefas }, signal)
  return validarAcoes(dados.acoes, resumoTarefas)
}
