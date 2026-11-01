const CHAVE = 'tasklab:tarefas'

export function semente() {
  return [
    { id: '1', titulo: 'Ler Vue', descricao: 'Revisar os conceitos essenciais do Vue 3.', concluida: false },
    { id: '2', titulo: 'Praticar CSS', descricao: 'Experimentar layout responsivo e acessível.', concluida: true },
    { id: '3', titulo: 'Revisar Vue', descricao: 'Consolidar o conteúdo estudado.', concluida: true },
  ]
}

export function salvar(tarefas) {
  localStorage.setItem(CHAVE, JSON.stringify(tarefas))
}

export function lerSalvas() {
  const bruto = localStorage.getItem(CHAVE)
  if (bruto === null) return null

  try {
    const dados = JSON.parse(bruto)
    if (
      !Array.isArray(dados) ||
      dados.some(
        (tarefa) =>
          !tarefa ||
          typeof tarefa.id !== 'string' ||
          tarefa.id.trim() === '' ||
          typeof tarefa.titulo !== 'string' ||
          tarefa.titulo.trim() === '' ||
          typeof tarefa.concluida !== 'boolean' ||
          (tarefa.descricao !== undefined && typeof tarefa.descricao !== 'string'),
      )
    ) {
      throw new Error('formato inválido')
    }

    const ids = new Set(dados.map((tarefa) => tarefa.id))
    if (ids.size !== dados.length) throw new Error('ids duplicados')

    return dados.map((tarefa) => ({
      id: tarefa.id,
      titulo: tarefa.titulo.trim().slice(0, 80),
      descricao: tarefa.descricao ?? '',
      concluida: tarefa.concluida,
    }))
  } catch {
    throw new Error('Os dados salvos estão corrompidos. Tente novamente para restaurar a lista inicial.')
  }
}
