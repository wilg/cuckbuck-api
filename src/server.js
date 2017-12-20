const express = require('express')
const CuckbuckAPI = require('./api')

class APIServer {

  constructor() {
    this.app = express()
    this.api = new CuckbuckAPI()

    this.app.get('/info.json', async (req, res) => {
      try {
        const blockCount = await this.api.blockCount()
        const lastBlockHeader = await this.api.lastBlockHeader()
        res.json({
          blockCount,
          lastBlockHeader
        })
      } catch (e) {
        res.json({
          error: e.message
        })
      }
    })

    const port = process.env.PORT || 8081

    this.app.listen(port, () => console.log(`API server listening on port ${port}!`))
  }

}

module.exports = APIServer
