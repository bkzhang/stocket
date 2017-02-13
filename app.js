'use strict'

const { app } = require('electron')
const appExpress = require('express')()
const url = require('url')
const bodyParser = require('body-parser')
const StocketWindow = require('./windows/controllers/StocketWindow')

appExpress.use(bodyParser.urlencoded({ extended: true }))

class Stocket {
  constructor() {
    this.stocketWindow = null
  }

  init() {
    this.initStocket()
  }

  initStocket() {
    app.on('ready', () => {
      this.createStocketWindow()
      this.stocketWindow.loadURL('http://localhost:8446/#AAPL')
      this.stocketWindow.devTools()
    })

    app.on('activate', () => {
      if (this.stocketWindow == null) {
        this.createStocketWindow()
      } else {
        this.stocketWindow.show()
      }
    })
  }

  createStocketWindow() {
    this.stocketWindow = new StocketWindow()
  }
}

new Stocket().init()
