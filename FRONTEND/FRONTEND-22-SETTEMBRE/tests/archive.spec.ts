import { expect, test, type APIRequestContext, type Page } from '@playwright/test'

const backend = 'http://localhost:8080/api'
async function login(request: APIRequestContext, role: 'ADMIN' | 'USER') {
  const response = await request.post(`${backend}/auth/login`, { data: { email: process.env[`VITE_TEST_${role}_EMAIL`], password: process.env[`VITE_TEST_${role}_PASSWORD`] } })
  expect(response.status()).toBe(200)
  return response.json()
}
async function quickLogin(page: Page, role: 'admin' | 'user') {
  await page.getByRole('button', { name: 'Accessi', exact: true }).click()
  await page.getByRole('button', { name: role === 'admin' ? 'Accedi come Admin (Javier)' : 'Accedi come Utente Standard', exact: true }).click()
  await expect(page.getByText('Accesso effettuato:', { exact: false })).toBeVisible()
  await page.getByRole('button', { name: 'Chiudi', exact: true }).click()
}

test('pubblico: solo DTO pubblici, cuore richiede login, admin protetto', async ({ page, request }) => {
  const products = await (await request.get(`${backend}/oggetti`)).json()
  expect(products.length).toBeGreaterThan(0)
  for (const product of products) expect(Object.keys(product).sort()).toEqual(['categoria', 'id', 'immagineUrl', 'inEvidenza', 'isSpecialEdition', 'nome', 'numeroRecensioni', 'prezzo', 'rating', 'variante'])
  await page.goto('/catalogo')
  await expect(page.locator('.product-card')).toHaveCount(products.length)
  await expect(page.getByText('BOZZA', { exact: true })).toHaveCount(0)
  await expect(page.getByText('DATI RISERVATI', { exact: true })).toHaveCount(0)
  await page.getByRole('button', { name: /Aggiungi ai preferiti:/ }).first().click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Bentornato.' })).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await page.goto('/admin')
  await expect(page).toHaveURL('/')
})

test('utente: salva e rimuove un preferito persistente senza dati admin', async ({ page, request }) => {
  const session = await login(request, 'USER')
  const headers = { Authorization: `Bearer ${session.token}` }
  const products = await (await request.get(`${backend}/oggetti`)).json()
  const favorites = await (await request.get(`${backend}/preferiti`, { headers })).json()
  const product = products.find((p: { id: string }) => !favorites.some((f: { oggetto: { id: string } }) => f.oggetto.id === p.id))
  expect(product).toBeTruthy()
  try {
    await page.goto('/catalogo')
    await quickLogin(page, 'user')
    const heart = page.getByRole('button', { name: `Aggiungi ai preferiti: ${product.nome}`, exact: true })
    await heart.click()
    await expect(page.getByRole('button', { name: `Rimuovi dai preferiti: ${product.nome}` })).toHaveAttribute('aria-pressed', 'true')
    await page.getByRole('link', { name: /preferiti/i }).first().click()
    await expect(page.locator('.product-card').filter({ hasText: product.nome })).toBeVisible()
    await page.reload()
    await expect(page.getByText('DATI RISERVATI', { exact: true })).toHaveCount(0)
    await quickLogin(page, 'user')
    await expect(page.locator('.product-card').filter({ hasText: product.nome })).toBeVisible()
    await expect(page.getByText('DATI RISERVATI', { exact: true })).toHaveCount(0)
    await page.getByRole('button', { name: `Rimuovi dai preferiti: ${product.nome}` }).click()
    await expect(page.locator('.product-card').filter({ hasText: product.nome })).toHaveCount(0)
  } finally { await request.delete(`${backend}/preferiti/${product.id}`, { headers }) }
})

test('admin: bozze, margini, creazione e eliminazione reali; logout ripulisce lo stato', async ({ page, request }) => {
  const session = await login(request, 'ADMIN')
  const headers = { Authorization: `Bearer ${session.token}` }
  const name = `QA Vintage ${Date.now()}`
  try {
    await page.goto('/catalogo')
    await quickLogin(page, 'admin')
    await expect(page.getByText('ADMIN MODE - JAVIER')).toBeVisible()
    await expect(page.getByText('BOZZA', { exact: true }).first()).toBeVisible()
    await expect(page.getByText('DATI RISERVATI', { exact: true }).first()).toBeVisible()
    await page.getByRole('link', { name: 'Studio admin' }).click()
    await page.getByRole('button', { name: 'Nuovo Capo Vintage' }).click()
    await page.getByRole('textbox', { name: 'Nome del capo' }).fill(name)
    await page.getByRole('spinbutton', { name: 'Prezzo di vendita' }).fill('100')
    await page.getByRole('spinbutton', { name: 'Prezzo d’acquisto' }).fill('30')
    await page.getByRole('textbox', { name: 'Fornitore', exact: true }).fill('QA locale')
    await page.getByRole('button', { name: 'Salva bozza', exact: true }).click()
    await expect(page.getByRole('dialog')).toHaveCount(0)
    await page.getByRole('link', { name: 'L’archivio', exact: true }).first().click()
    const card = page.locator('.product-card').filter({ hasText: name })
    await expect(card.getByText('BOZZA', { exact: true })).toBeVisible()
    expect((await (await request.get(`${backend}/oggetti`)).json()).some((p: { nome: string }) => p.nome === name)).toBe(false)
    await card.getByRole('button', { name: 'Elimina Capo' }).click()
    await page.getByRole('dialog').getByRole('button', { name: 'Elimina Capo', exact: true }).click()
    await expect(card).toHaveCount(0)
    await page.getByRole('button', { name: 'Accessi', exact: true }).click()
    await page.getByRole('button', { name: 'Logout', exact: true }).click()
    await page.getByRole('button', { name: 'Chiudi', exact: true }).click()
    await expect(page.getByText('BOZZA', { exact: true })).toHaveCount(0)
    await expect(page.getByText('DATI RISERVATI', { exact: true })).toHaveCount(0)
    await expect(page.getByText('ADMIN MODE - JAVIER')).toHaveCount(0)
  } finally {
    const products = await (await request.get(`${backend}/oggetti`, { headers })).json()
    for (const product of products.filter((p: { nome: string }) => p.nome === name)) await request.delete(`${backend}/oggetti/${product.id}`, { headers })
  }
})

test('sicurezza reale: query preferiti isolata e mutazioni vietate allo standard', async ({ request }) => {
  const admin = await login(request, 'ADMIN')
  const user = await login(request, 'USER')
  const ah = { Authorization: `Bearer ${admin.token}` }
  const uh = { Authorization: `Bearer ${user.token}` }
  const products = await (await request.get(`${backend}/oggetti`)).json()
  const af = await (await request.get(`${backend}/preferiti`, { headers: ah })).json()
  const uf = await (await request.get(`${backend}/preferiti`, { headers: uh })).json()
  const product = products.find((p: { id: string }) => ![...af, ...uf].some((f: { oggetto: { id: string } }) => f.oggetto.id === p.id))
  expect(product).toBeTruthy()
  try {
    expect((await request.post(`${backend}/preferiti/${product.id}`, { headers: ah })).status()).toBe(201)
    expect((await (await request.get(`${backend}/preferiti`, { headers: ah })).json()).some((f: { oggetto: { id: string } }) => f.oggetto.id === product.id)).toBe(true)
    expect((await (await request.get(`${backend}/preferiti`, { headers: uh })).json()).some((f: { oggetto: { id: string } }) => f.oggetto.id === product.id)).toBe(false)
    expect((await request.get(`${backend}/preferiti`)).status()).toBe(403)
    expect((await request.post(`${backend}/oggetti`, { headers: uh, data: { nome: 'Unauthorized test', prezzo: 1, prezzoAcquisto: 0, fornitore: 'test', pubblicato: false } })).status()).toBe(403)
    const drafts = (await (await request.get(`${backend}/oggetti`, { headers: ah })).json()).filter((p: { pubblicato: boolean }) => p.pubblicato === false)
    expect(drafts.length).toBeGreaterThan(0)
    expect((await request.get(`${backend}/oggetti/${drafts[0].id}`)).status()).toBe(404)
  } finally { await request.delete(`${backend}/preferiti/${product.id}`, { headers: ah }) }
})

test('admin: promozione e revoca ruoli con conferma e verifica server', async ({ page, request }) => {
  const admin = await login(request, 'ADMIN')
  const user = await login(request, 'USER')
  const headers = { Authorization: `Bearer ${admin.token}` }
  const endpoint = `${backend}/admin/utenti/${user.user.id}/ruolo-admin`
  try {
    await page.goto('/')
    await quickLogin(page, 'admin')
    await page.getByRole('link', { name: 'Studio admin' }).click()
    await page.getByRole('textbox', { name: 'ID utente (UUID)' }).fill(user.user.id)
    await page.getByRole('button', { name: 'Promuovi ADMIN' }).click()
    await page.getByRole('button', { name: 'Conferma', exact: true }).click()
    await expect(page.locator('.role-result')).toContainText('ROLE_ADMIN')
    expect((await login(request, 'USER')).user.roles).toContain('ADMIN')
    await page.getByRole('button', { name: 'Revoca ADMIN', exact: true }).click()
    await page.getByRole('button', { name: 'Conferma', exact: true }).click()
    await expect(page.locator('.role-result')).not.toContainText('ROLE_ADMIN')
    expect((await login(request, 'USER')).user.roles).not.toContain('ADMIN')
  } finally { await request.delete(endpoint, { headers }) }
})

test('layout desktop e mobile, immagini caricate e nessun overflow', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  await page.goto('/')
  await expect(page.locator('.product-card').first()).toBeVisible()
  const ritratti = page.locator('.carta-leggenda img')
  await expect(ritratti).toHaveCount(3)
  for (const ritratto of await ritratti.all()) {
    await expect(ritratto).toHaveJSProperty('complete', true)
    expect(await ritratto.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0)
  }
  await page.screenshot({ path: 'artifacts/desktop.png', fullPage: true })
  await page.setViewportSize({ width: 390, height: 844 })
  await expect(page.getByRole('heading', { name: 'Y2K ATHLETIC & STREETWEAR ARCHIVE.' })).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  await page.screenshot({ path: 'artifacts/mobile.png', fullPage: true })
  expect(errors).toEqual([])
})
