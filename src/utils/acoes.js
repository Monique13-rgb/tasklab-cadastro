import { filtroValido, ROTULOS_FILTRO, validarFiltroIA } from './filtros'

const MAXIMO_TITULO = 80

export function validarAcoes(lista, tarefas, maximo = 3) {
  if (!Array.isArray(lista)) return []

  const existentes = new Map(tarefas.map((tarefa) => [String(tarefa.id), tarefa]))
  const saida = []

  for (const item of lista) {
    if (saida.length === maximo) break
    if (!item || typeof item !== 'object') continue

    if (item.acao === 'adicionar') {
      const titulo = typeof item.titulo === 'string' ? item.titulo.trim().slice(0, MAXIMO_TITULO) : ''
      if (titulo) saida.push({ acao: 'adicionar', titulo })
    } else if (item.acao === 'alternar' || item.acao === 'editar') {
      const id = typeof item.id === 'string' ? item.id : ''
      if (!existentes.has(id)) continue

      if (item.acao === 'alternar') {
        saida.push({ acao: 'alternar', id })
      } else {
        const titulo = typeof item.titulo === 'string' ? item.titulo.trim().slice(0, MAXIMO_TITULO) : ''
        if (titulo) saida.push({ acao: 'editar', id, titulo })
      }
    } else if (item.acao === 'filtrar') {
      const filtro = validarFiltroIA(item)
      saida.push({ acao: 'filtrar', ...filtro })
    }
  }

  return saida
}

export function descreverAcao(acao, tarefas) {
  if (acao.acao === 'adicionar') return `Adicionar a tarefa “${acao.titulo}”`
  if (acao.acao === 'alternar') {
    const tarefa = tarefas.find((item) => item.id === acao.id)
    return tarefa
      ? `Alternar a situação de “${tarefa.titulo}” (agora ${tarefa.concluida ? 'concluída' : 'pendente'})`
      : 'Alternar a situação de uma tarefa'
  }
  if (acao.acao === 'editar') {
    const tarefa = tarefas.find((item) => item.id === acao.id)
    return `Renomear “${tarefa?.titulo ?? ''}” para “${acao.titulo}”`
  }

  const filtro = filtroValido(acao.filtro)
  const rotulo = ROTULOS_FILTRO[filtro].toLocaleLowerCase('pt-BR')
  return acao.busca ? `Mostrar ${rotulo} que correspondem a “${acao.busca}”` : `Mostrar ${rotulo}`
}
