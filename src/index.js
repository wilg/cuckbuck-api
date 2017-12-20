const CuckbuckAPI = require('./api')

const api = new CuckbuckAPI()

api.blockCount().then((result) => {
  console.log(result)
})
