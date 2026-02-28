import { app as electronApp, BrowserWindow } from 'electron'
import path from 'path'
import { spawn } from 'child_process'
import { fileURLToPath } from 'url'
import { createServer } from 'http'
import serveHandler from 'serve-handler'

const PORT = 3000

// --- __dirname en ES modules ---
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// --- DB Prisma ---
const dbPath = path.join(electronApp.getPath('userData'), 'data.db')
process.env.DATABASE_URL = `file:${dbPath}`

let backendProcess

// ---------------- BACKEND ----------------
function startBackend() {
  try {
    const backendPath = path.join(__dirname, '../back/src/server.js')

    backendProcess = spawn('node', [backendPath], {
      env: { ...process.env, BACK_PORT: 3001 },
      stdio: 'inherit'
    })

    console.log('✅ Backend lancé')
  } catch (err) {
    console.error('❌ Backend error :', err)
  }
}

// ---------------- FRONTEND ----------------
function startFrontendServer() {
  return new Promise((resolve) => {
    const publicPath = path.join(__dirname, '../front/.output/public')

    const server = createServer((request, response) => {
      return serveHandler(request, response, {
        public: publicPath,
        cleanUrls: true,
        rewrites: [{ source: '**', destination: '/index.html' }]
      })
    })

    server.listen(PORT, () => {
      console.log(`🌐 Frontend sur http://localhost:${PORT}`)
      resolve(PORT)
    })
  })
}

// ---------------- WINDOW ----------------
function createWindow(port) {
  const win = new BrowserWindow({
    // width: 1200,
    // height: 800,
    fullscreen: true,
    frame: false, // ❌ masque la barre d'outils / titre
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true
    }
  })

  win.loadURL(`http://localhost:${port}`)
  // win.webContents.openDevTools() // Ouvre la console du navigateur
}

// ---------------- APP ----------------
electronApp.whenReady().then(async () => {
  console.log('📁 DB path:', dbPath)

  console.log('⏳ Démarrage backend...')
  startBackend()

  console.log('⏳ Démarrage frontend...')
  const port = await startFrontendServer()

  createWindow(port)
})

// ---------------- CLEANUP ----------------
electronApp.on('will-quit', () => {
  if (backendProcess) backendProcess.kill()
})