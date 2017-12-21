const express = require('express')
const cors = require('cors')
const CuckbuckAPI = require('./api')

const https = require('https')
const fs = require('fs')
const { promisify } = require('util')

const readFileAsync = promisify(fs.readFile)

class APIServer {

  constructor() {
    this.app = express()
    this.app.use(cors())

    this.api = new CuckbuckAPI()

    this.app.get('/info.json', async (req, res) => {
      try {
        const [
          blockCount,
          lastBlockHeader,
          currencyData,
        ] = await Promise.all([
          this.api.blockCount(),
          this.api.lastBlockHeader(),
          this.getCurrencyData()
        ])
        res.json({
          blockCount,
          lastBlockHeader,
          currencyData,
        })
      } catch (e) {
        res.json({
          error: e.message
        })
      }
    })

    const port = process.env.PORT || 8081

    if (fs.existsSync('./ssl/key.pem')) {
      const httpsOptions = {
        key: fs.readFileSync('./ssl/key.pem'),
        cert: fs.readFileSync('./ssl/cert.pem')
      }
      https.createServer(httpsOptions, this.app).listen(port, () => {
        console.log(`HTTPS server listening on port ${port}!`)
      })
    } else {
      this.app.listen(port, () => {
        console.log(`HTTP server listening on port ${port}!`)
      })
    }

  }

  async getCurrencyData() {
    if (process.env.CURRENCY_DATA_PATH) {
      const data = await readFileAsync(process.env.CURRENCY_DATA_PATH)
      return JSON.parse(data)
    } else {
      null
    }
  }

}

module.exports = APIServer
