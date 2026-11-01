import { createRouter, createWebHistory } from 'vue-router'
import ListaView from '../views/ListaView.vue'
import NaoEncontradaView from '../views/NaoEncontradaView.vue'
import ResumoView from '../views/ResumoView.vue'
import TarefaView from '../views/TarefaView.vue'
import { FILTROS } from '../utils/filtros'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'lista', component: ListaView },
    { path: '/resumo', name: 'resumo', component: ResumoView },
    { path: '/tarefa/:id', name: 'tarefa', component: TarefaView, props: true },
    { path: '/:pathMatch(.*)*', name: 'nao-encontrada', component: NaoEncontradaView },
  ],
})

router.beforeEach((to) => {
  if (to.name !== 'lista' && to.name !== 'resumo') return true

  const query = { ...to.query }
  let alterada = false
  if (query.filtro !== undefined) {
    const filtro = typeof query.filtro === 'string' ? query.filtro.toLocaleLowerCase('pt-BR') : ''
    if (!FILTROS.includes(filtro) || filtro === 'todas') {
      delete query.filtro
      alterada = true
    } else if (filtro !== query.filtro) {
      query.filtro = filtro
      alterada = true
    }
  }

  if (query.busca !== undefined) {
    const busca = typeof query.busca === 'string' ? query.busca.trim().slice(0, 40) : ''
    if (!busca) {
      delete query.busca
      alterada = true
    } else if (busca !== query.busca) {
      query.busca = busca
      alterada = true
    }
  }

  return alterada ? { name: to.name, query, hash: to.hash, replace: true } : true
})

export default router
