import { defineConfig, devices } from '@playwright/test'
import { readFileSync } from 'node:fs'

for (const line of readFileSync('.env.local', 'utf8').split('\n')) {
  const separator = line.indexOf('=')
  if (separator > 0) process.env[line.slice(0, separator)] ??= line.slice(separator + 1)
}
export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  timeout: 30000,
  reporter: 'list',
  use: { baseURL: 'http://127.0.0.1:5173', trace: 'off', screenshot: 'only-on-failure' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 1000 } } }],
  webServer: { command: 'npm run dev -- --host 127.0.0.1', url: 'http://127.0.0.1:5173', reuseExistingServer: true },
})
