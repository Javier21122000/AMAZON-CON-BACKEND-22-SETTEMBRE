import { expect, test } from '@playwright/test'

const backend = 'http://localhost:8080/api'

test('catalogo: filtri, varianti, immagini isolate, recensioni e accessibilità tastiera', async ({ page, request }) => {
  const products = await (await request.get(`${backend}/oggetti`)).json()
  expect(products.length).toBeGreaterThanOrEqual(28)
  expect(products.filter((p: { isSpecialEdition: boolean }) => p.isSpecialEdition)).toHaveLength(6)
  for (const name of ['Vintage 00s Striped Shirt', 'Oldculture Graphic Sweatshirt']) {
    const variants = products.filter((p: { nome: string }) => p.nome === name)
    expect(variants).toHaveLength(2)
    expect(new Set(variants.map((p: { immagineUrl: string }) => p.immagineUrl)).size).toBe(2)
  }
  await page.goto('/catalogo')
  await expect(page.locator('.product-card')).toHaveCount(products.length)
  await expect(page.locator('.quick-edit-button')).toHaveCount(0)
  for (const category of ['Top & Camicie', 'Scarpe', 'Pantaloni', 'SPECIAL EDITIONS']) {
    await page.getByRole('button', { name: category, exact: true }).click()
    const expected = products.filter((p: { categoria: string; isSpecialEdition: boolean }) => category === 'SPECIAL EDITIONS' ? p.isSpecialEdition : p.categoria === category)
    await expect(page.locator('.product-card')).toHaveCount(expected.length)
    for (const card of await page.locator('.product-card').all()) {
      await expect(card.locator('.product-reviews')).toBeVisible()
      const img = card.locator('img')
      await expect(img).toHaveJSProperty('complete', true)
      expect(await img.evaluate((node: HTMLImageElement) => node.naturalWidth)).toBeGreaterThan(0)
      await expect(img).toHaveCSS('object-fit', 'contain')
      const box = await card.locator('.product-image').boundingBox()
      expect(box!.width / box!.height).toBeCloseTo(.8, 2)
    }
  }
  const card = page.locator('.product-card').first()
  await card.locator('img').click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.keyboard.press('Escape')
  await card.focus()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.keyboard.press('Escape')
  await card.getByRole('button', { name: /Aggiungi ai preferiti/ }).focus()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('heading', { name: 'Bentornato.' })).toBeVisible()
  await expect(page.getByRole('textbox', { name: 'Email', exact: true })).toHaveValue('')
})

test('login test admin, modifica PUT, metadati conservati, sessione Guest al reload', async ({ page, request }) => {
  const session = await (await request.post(`${backend}/auth/login`, { data: { email: 'javier@archivio00.it', password: 'admin123' } })).json()
  const headers = { Authorization: `Bearer ${session.token}` }
  const products = await (await request.get(`${backend}/oggetti`, { headers })).json()
  const original = products.find((p: { nome: string }) => p.nome === 'Artistic Renaissance Denim (Spezzettata)')
  const changedName = `${original.nome} QA`
  try {
    await page.goto('/catalogo')
    await page.locator('.heart-button').first().click()
    await page.getByRole('button', { name: 'LOGIN TEST ADMIN', exact: true }).click()
    await expect(page.getByRole('dialog')).toHaveCount(0)
    const card = page.locator('.product-card').filter({ hasText: original.nome })
    await card.hover()
    await card.getByRole('button', { name: `Modifica: ${original.nome}`, exact: true }).click()
    await expect(page.getByRole('dialog')).toHaveCount(1)
    await page.getByRole('textbox', { name: 'Nome del capo' }).fill(changedName)
    await page.getByRole('spinbutton', { name: 'Prezzo di vendita' }).fill('399')
    await page.getByRole('switch', { name: 'In evidenza', exact: true }).click()
    await page.getByRole('switch', { name: 'Special Edition', exact: true }).click()
    await page.getByRole('button', { name: 'Salva modifiche', exact: true }).click()
    await expect(page.getByRole('dialog')).toHaveCount(0)
    await page.getByRole('button', { name: 'SPECIAL EDITIONS', exact: true }).click()
    const edited = page.locator('.product-card').filter({ hasText: changedName })
    await expect(edited).toBeVisible()
    await expect(edited.locator('.product-special')).toBeVisible()
    await expect(edited.locator('.feature-badge')).toHaveCount(original.inEvidenza ? 0 : 1)
    const updated = await (await request.get(`${backend}/oggetti/${original.id}`)).json()
    expect(updated).toMatchObject({ prezzo: 399, isSpecialEdition: true, rating: original.rating, numeroRecensioni: original.numeroRecensioni, categoria: original.categoria, immagineUrl: original.immagineUrl })
    await page.reload()
    await expect(page.locator('.quick-edit-button')).toHaveCount(0)
    await expect(page.getByText('DATI RISERVATI', { exact: true })).toHaveCount(0)
    await page.locator('.heart-button').first().click()
    await page.getByRole('button', { name: 'LOGIN TEST UTENTE', exact: true }).click()
    await expect(page.getByRole('dialog')).toHaveCount(0)
    await expect(page.locator('.quick-edit-button')).toHaveCount(0)
    const denied = await request.put(`${backend}/oggetti/${original.id}`, { data: original })
    expect(denied.status()).toBe(403)
    const invalid = await request.put(`${backend}/oggetti/${original.id}`, { headers, data: { ...original, rating: 6 } })
    expect(invalid.status()).toBe(400)
  } finally {
    expect((await request.put(`${backend}/oggetti/${original.id}`, { headers, data: original })).status()).toBe(200)
  }
})

test('catalogo desktop e mobile: tutte le immagini caricate, filtri e nessun overflow', async ({ page, request }) => {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  const published = await (await request.get(`${backend}/oggetti`)).json()
  await page.goto('/catalogo')
  await expect(page.locator('.product-card')).toHaveCount(published.length)
  for (const img of await page.locator('.product-card img').all()) {
    await img.scrollIntoViewIfNeeded()
    await expect(img).toHaveJSProperty('complete', true)
    expect(await img.evaluate((node: HTMLImageElement) => node.naturalWidth)).toBeGreaterThan(0)
  }
  for (const card of await page.locator('.product-card').all()) await expect(card).toHaveCSS('opacity', '1')
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
  await page.screenshot({ path: 'artifacts/catalog-desktop.png', fullPage: true, animations: 'disabled' })
  await page.setViewportSize({ width: 390, height: 844 })
  await page.getByRole('button', { name: 'Top & Camicie', exact: true }).click()
  await expect(page.locator('.product-card')).toHaveCount(5)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  await expect(page.getByRole('button', { name: 'Top & Camicie', exact: true })).toHaveCSS('background-color', 'rgb(23, 23, 23)')
  for (const card of await page.locator('.product-card').all()) {
    await card.scrollIntoViewIfNeeded()
    await expect(card).toHaveCSS('opacity', '1')
  }
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
  await page.screenshot({ path: 'artifacts/catalog-mobile.png', fullPage: true, animations: 'disabled' })
  expect(errors).toEqual([])
})
