if (process.env.USAR_MOCK === undefined) {
  process.env.USAR_MOCK = '1'
}

await import('../server/proxy.mjs')
