export const FILTROS = ['todas', 'pendentes', 'concluidas']
export const ROTULOS_FILTRO = {
  todas: 'Todas',
  pendentes: 'Pendentes',
  concluidas: 'Concluídas',
}

export function filtroValido(valor) {
  return FILTROS.includes(valor) ? valor : 'todas'
}

export function validarFiltroIA(dados) {
  const busca = typeof dados?.busca === 'string' ? dados.busca.trim().slice(0, 40) : ''
  return { busca, filtro: filtroValido(dados?.filtro) }
}

export function aplicarFiltro(tarefas, busca, filtro) {
  const termo = busca.trim().toLocaleLowerCase('pt-BR')
  return tarefas.filter((tarefa) => {
    if (filtro === 'pendentes' && tarefa.concluida) return false
    if (filtro === 'concluidas' && !tarefa.concluida) return false
    return !termo || tarefa.titulo.toLocaleLowerCase('pt-BR').includes(termo)
  })
}
