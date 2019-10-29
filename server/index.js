elasticsearch = require('elasticsearch')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const path = require('path')
const helper = require('./utils')

const client = new elasticsearch.Client({
  hosts: ['http://localhost:9200']
})
const size = 15

client.ping(
  {
    requestTimeout: 30000
  },
  function(error) {
    if (error) {
      console.error('elasticsearch cluster is down!')
    } else {
      console.log('Everything is ok')
    }
  }
)

app.use(bodyParser.json())

app.set('port', process.env.PORT || 3001)

app.use(express.static(path.join(__dirname, 'public')))

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  next()
})

app.get('/products', function(req, res) {
  const search = req.query['query']
  const page = req.query['page']
  const sortBy = req.query['sort']
  const from = page == 0 ? page : size * page + 1
  const sort = helper.getSort(sortBy)
  const query = helper.getQuery(search)
  const body = {
    size,
    from,
    query,
    sort
  }
  console.log(body)
  client
    .search({
      index: 'elastic-vue-products',
      body: body,
      type: 'products_list'
    })
    .then(results => {
      res.send(results.hits)
    })
    .catch(err => {
      console.log(err)
      res.send([])
    })
})

app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'))
})
