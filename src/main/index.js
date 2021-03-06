import { app, BrowserWindow, Menu, ipcMain, dialog } from 'electron'
import path from 'path'
import Menubar from './menus/Menubar'
import storage from './storage'
import worker from './workers'
import { dispatch } from './ipc'
import { checkOnLaunch } from './install_ai_plugin'
import { getStaticPath } from '../lib'

const state = {
  ready: false,
  quitting: false,
  mainWindow: null,
  settingsWindow: null,
  selectedProject: null,
  data: null,
  staticPath: getStaticPath(),
}

export default state

const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function appReady (launchInfo) {
  state.ready = true
  storage.load((error, data) => {
    state.data = data
    state.selectedProject = data.Projects.find(p => p.focus)
    createWindow()
    Menu.setApplicationMenu( Menubar() )

  })
}

app.on('ready', appReady)

function createWindow () {
  if ( state.mainWindow ) return

  /**
   * Initial window options
   */
  state.mainWindow = new BrowserWindow({
    useContentSize: true,
    titleBarStyle: 'hidden',
    maximizable: false,
    fullscreenable: false,
    width: 320,
    minWidth: 240,
    maxWidth: 620,
    height: 563,
    minHeight: 240,
    show: false,
    webPreferences: {
      webgl: false,
      webaudio: false,
      textAreasAreResizeable: false,
    },
  })

  state.mainWindow.loadURL(winURL)

  if (process.platform == 'darwin')
    state.mainWindow.setSheetOffset(22)

  state.mainWindow.on('close', (eve) => {
    if (process.platform === 'darwin' && !state.quitting) {
      eve.preventDefault()
      state.mainWindow.hide()
    }
  })

  state.mainWindow.once('show', () => checkOnLaunch())

  state.mainWindow.on('closed', () => state.mainWindow = null)
  state.mainWindow.on('ready-to-show', () => state.mainWindow.show())
}

app.on('before-quit', () => state.quitting = true)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (!state.ready || !state.data) return;
  if (state.mainWindow) state.mainWindow.show()
  else if (state.mainWindow === null) createWindow()
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

import { autoUpdater } from 'electron-updater'

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') {
    // This is supposedly unnecessary. But it doesn't work without it.
    autoUpdater.channel = AUTOUPDATE_CHANNEL
    autoUpdater.allowDowngrade = false
    autoUpdater.setFeedURL('https://apps.voxmedia.com/vizapp/')

    autoUpdater.checkForUpdatesAndNotify()
  }
})
