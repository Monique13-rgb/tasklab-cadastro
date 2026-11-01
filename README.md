# TaskLab

Gerenciador de tarefas desenvolvido com Vue 3, Pinia e Vue Router, reunindo os desafios do Sábado 1 e os exercícios do Sábado 3.

**Integrantes:** preencher com os nomes do grupo antes da entrega.

## Requisitos

- Node.js `>=22.18.0`
- npm

## Instalação e execução

Na raiz desta pasta, instale as dependências:

```powershell
npm install
```

Inicie a aplicação e o proxy simulado juntos em um terminal:

```powershell
npm run dev
```

O proxy local é iniciado automaticamente em modo simulado e não precisa de uma chave ou de um segundo terminal. A interface estará no endereço local exibido pelo Vite. Se precisar iniciar os serviços separadamente, rode `npm run dev:proxy` em um terminal e `npm run dev:vite` em outro.

O proxy usa apenas módulos nativos do Node, funciona sem chave e não precisa de internet no modo simulado. O Vite encaminha as requisições `/api` para `http://127.0.0.1:3001`. O script separado do proxy também usa o modo simulado por padrão; defina `USAR_MOCK=0` explicitamente apenas se configurar a chave real como variável de ambiente no servidor.

Para validar a compilação e testar a versão de produção, encerre o modo de desenvolvimento e use:

```powershell
npm run build
npm run preview
```

O `preview` também inicia o proxy simulado e encaminha as chamadas `/api`, para que os recursos de IA continuem disponíveis na versão compilada.

## Estrutura

```text
src/
  components/    Formulário, item, indicadores e componentes de IA
  composables/   Sincronização dos filtros com a URL
  router/        Lista, resumo, detalhe e rota 404
  services/      Chamadas HTTP ao proxy de IA
  stores/        Estado compartilhado e ações de tarefas com Pinia
  utils/         Persistência, filtros e validação das respostas
  views/         Telas de lista, resumo, detalhe e 404
server/          Proxy local e modo simulado fornecidos para a atividade
```

## Funcionalidades entregues

- Cadastro, conclusão, reabertura e remoção de tarefas.
- Busca parcial sem diferenciar maiúsculas/minúsculas; filtros por todas, pendentes ou concluídas; combinação de critérios, limpeza e estados vazios distintos.
- Store Pinia compartilhada entre lista e resumo, com totais, pendências, conclusão e percentual.
- Persistência no `localStorage`, indicação de carregamento/erro, recuperação explícita de dados corrompidos e aviso quando o navegador não consegue salvar.
- Rotas `/`, `/resumo`, `/tarefa/:id` e 404. Os parâmetros `busca` e `filtro` da query reproduzem os filtros ao abrir ou compartilhar a URL.
- Edição local de título e descrição, salvar/cancelar, retorno à lista após remoção e confirmação de saída com alterações pendentes.
- Sugestões de passos em `/api/quebrar`, inclusão individual ou em lote e interpretação de filtros em `/api/filtrar`.
- Assistente em `/api/agir`: apresenta uma lista legível de ações permitidas (adicionar, alternar, editar e filtrar) para aprovação individual, aprovação em lote ou descarte. A IA não pode remover tarefas.
- Respostas de IA são tratadas como dados, validadas por allowlist e exibidas como texto interpolado; a lista de tarefas enviada ao proxy contém somente id, título e situação.

## Decisões técnicas e segurança

- **Pinia** mantém uma única fonte de verdade; indicadores e telas derivam do mesmo estado.
- A URL é a fonte dos filtros de busca e situação. Enquanto a pessoa digita, a navegação usa `replace`; ações explícitas do assistente usam `push`.
- O modo simulado do proxy é a configuração padrão para a atividade. O código do proxy também contém um modo real; se usado, a chave deve ficar somente numa variável de ambiente do servidor, nunca no Vue ou no repositório.
- A edição proposta pela IA é validada pelo cliente e pelo plano de aprovação. A resposta do proxy não é executada diretamente, e ações não permitidas ou com ids inexistentes são descartadas.
- O armazenamento local é independente do repositório JSON do proxy. O Vue nunca acessa diretamente arquivos do servidor.

## Checklist da entrega

- [x] Sete desafios da lista e filtros.
- [x] Store, indicadores, total e percentual.
- [x] Persistência, limpeza das concluídas e recuperação.
- [x] Rotas, filtros por URL, detalhe e 404.
- [x] Edição com rascunho, confirmação de navegação e remoção.
- [x] Sugestões em lote e assistente com aprovação e validação.
- [x] Build de produção e preview verificados.
- [ ] Preencher os nomes dos integrantes acima.
