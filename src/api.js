require('dotenv').config()
const jayson = require('jayson')

class CuckbuckAPI {

  constructor() {
    this.client = jayson.client.http(process.env.DAEMON_URL)
  }

  async blockCount() {
    return (await this.request('getblockcount')).count
  }

  async lastBlockHeader() {
    return (await this.request('getlastblockheader')).block_header
  }

  async request(rpcName) {
    return new Promise((resolve, reject) => {
      this.client.request(rpcName, [], null, function (err, msg) {
        if (err) {
          reject(err)
        } else {
          resolve(msg.result)
        }
      });
    })
  }

}

module.exports = CuckbuckAPI
