<script setup>
import { onMounted } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { useTarefasStore } from './stores/tarefas'

const store = useTarefasStore()
const route = useRoute()

onMounted(() => store.carregar())
</script>

<template>
  <div class="app-shell">
    <header class="topbar">
      <RouterLink class="brand" :to="{ name: 'lista' }" aria-label="TaskLab, ir para tarefas">
        <span class="brand-mark" aria-hidden="true">T</span>
        <span>TaskLab</span>
      </RouterLink>
      <nav class="main-nav" aria-label="Navegação principal">
        <RouterLink :to="{ name: 'lista', query: route.query }">Tarefas</RouterLink>
        <RouterLink :to="{ name: 'resumo', query: route.query }">
          Resumo <span class="nav-count">{{ store.totalPendentes }}</span>
        </RouterLink>
      </nav>
    </header>

    <main class="page-container">
      <div v-if="store.carregando" class="state-card" role="status" aria-live="polite">
        <span class="spinner" aria-hidden="true"></span>
        <p>Carregando suas tarefas…</p>
      </div>

      <section v-else-if="store.erro" class="state-card error-card" role="alert">
        <h1>Não foi possível carregar as tarefas</h1>
        <p>{{ store.erro }}</p>
        <button type="button" class="button button-primary" @click="store.tentarNovamente">
          Tentar de novo
        </button>
      </section>

      <template v-else>
        <p v-if="store.storageError" class="notice notice-error" role="alert">
          {{ store.storageError }}
        </p>
        <p v-if="store.mensagem" class="notice notice-success" role="status" aria-live="polite">
          {{ store.mensagem }}
        </p>
        <RouterView />
      </template>
    </main>

    <footer class="footer">Organize o que importa, um passo de cada vez.</footer>
  </div>
</template>
