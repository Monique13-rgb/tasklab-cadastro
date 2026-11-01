# Proxy local do TaskLab

Execute os comandos na raiz do projeto, em um terminal separado do Vite:

```powershell
$env:USAR_MOCK = '1'
node .\server\proxy.mjs
```

O modo simulado não precisa de chave nem de acesso à internet. O servidor escuta em `http://127.0.0.1:3001`; o Vite encaminha as chamadas `/api` para ele. Para iniciar a interface, use `npm run dev` em outro terminal.

O modo real só deve ser usado com uma chave mantida em variável de ambiente no servidor. Nunca coloque chaves no código, no navegador, no repositório ou em conversas.
