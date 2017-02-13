'use strict'

const path = require('path')
const { app, BrowserWindow } = require('electron')
const shortcut = require('electron-localshortcut')

class StocketWindow {
  constructor() {
    this.createStocketWindow()
  }

  createStocketWindow() {
    this.stocketWindow = new BrowserWindow({
      width: 800,
      height: 600,
      backgroundColor: '#f2f2f2'
    })
  }

  loadURL(url) {
    this.stocketWindow.loadURL(url)
  }

  show() {
    this.stocketWindow.show()
  }

  devTools() {
    this.stocketWindow.webContents.openDevTools()
  }

  windowEvents() {
    this.stocketWindow.on('close', (e) => {
      if (this.stocketWindow.isVisible()) {
        e.preventDefault()
        this.stocketWindow.hide()
      }
      this.unregister()
    })

    this.stocketWindow.on('show', () => {
      this.register()
    })
  }

  register() {
    shortcut.register(this.stocketWindow, 'Esc', () => {
      console.log('Escape shortcut is registered:', shortcut.isRegistered(this.stocketWindow, 'Esc')) 
      this.stocketWindow.close()
    })
  }

  unregister() {
    shortcut.unregister(this.stocketWindow, 'Esc')
    console.log('Escape shortcut is registered:', shortcut.isRegistered(this.stocketWindow, 'Esc'))
  }

  initShortCut() {
    this.register()
  }
}

module.exports = StocketWindow
