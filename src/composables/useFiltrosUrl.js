import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { filtroValido } from '../utils/filtros'

export function useFiltrosUrl() {
  const route = useRoute()
  const router = useRouter()

  const busca = computed(() => (typeof route.query.busca === 'string' ? route.query.busca : ''))
  const filtro = computed(() => filtroValido(route.query.filtro))

  function aplicar(novos, { empurrar = false } = {}) {
    const query = { ...route.query, ...novos }
    if (!query.busca) delete query.busca
    if (!query.filtro || query.filtro === 'todas') delete query.filtro
    const navegar = empurrar ? router.push : router.replace
    return navegar.call(router, { name: 'lista', query })
  }

  return { busca, filtro, aplicar }
}
