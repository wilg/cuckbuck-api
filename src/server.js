const express = require('express')
const cors = require('cors')
const CuckbuckAPI = require('./api')

const https = require('https')
const fs = require('fs')

class APIServer {

  constructor() {
    this.app = express()
    this.app.use(cors())

    this.api = new CuckbuckAPI()

    this.app.get('/info.json', async (req, res) => {
      try {
        const blockCount = await this.api.blockCount()
        const lastBlockHeader = await this.api.lastBlockHeader()
        let currencyData = null
        if (process.env.CURRENCY_DATA_PATH) {
          currencyData = JSON.parse(fs.readFileSync(process.env.CURRENCY_DATA_PATH))
        }
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

}

module.exports = APIServer
