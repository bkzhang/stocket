'use strict'

const app = require('express')()
const path = require('path')
const server = require('http').createServer(app)
const https = require('https')
const io = require('socket.io')(server)
const cors = require('cors')

app.use(cors())

const port = process.env.PORT || 8446

const fetch_interval = 5000
const print_json = true

function getQuotes(socket, ticker) {
  https.get({
    port: 442,
    method: 'GET',
    hostname: 'www.google.com',
    path: '/finance/info?client=ig&q=' + ticker,
    timeout: 1000
  }, (res) => {
    res.setEncoding('utf8')
    const data = ''

    res.on('data', (chunk) => {
      data += chunk
    })

    res.on('end', () => {
      if(data.length > 0) {
        let json
        try {
          json = JSON.parse(data.substring(3))
        } catch(e) {
          console.log(e)
          return false
        }

        const quote = {}
        quote.ticker = json[0].t
        quote.exchange = json[0].e
        quote.price = json[0].l_cur
        quote.change = json[0].c
        quote.change_percent = json[0].cp
        quote.last_trade_time = json[0].lt
        quote.dividend = json[0].div
        quote.yield = json[0].yld

        socket.emit(ticker, print_json ? JSON.stringify(quote, null, 4) : JSON.stringify(quote))
      }
    })
  })
}

function trackTicker(socket, ticker) {
  getQuotes(socket, ticker)

  let timer = setInterval(() => {
    getQuotes(socket, ticker)
  }, fetch_interval)

  socket.on('disconnect', () => {
    clearInterval(timer)
  })
}

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

io.sockets.on('connection', (socket) => {
  console.log('%s is logged', socket.id)

  socket.on('ticker', (ticker) => {
    trackTicker(socket, ticker)
  })
})

server.listen(port, () => {
  console.log('Listening on http://localhost:' + port + '/#AAPL')
})
