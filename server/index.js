const elasticsearch = require('elasticsearch')

const client = new elasticsearch.Client({
  hosts: ['http://localhost:9200']
})

const express = require('express')

const app = express()

const bodyParser = require('body-parser')

const path = require('path')

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

app.get('/search', function(req, res) {
  const body = {
    size,
    query: {
      match: {
        name: req.query['q']
      }
    }
  }
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

app.get('/products', function(req, res) {
  const search = req.query['q']
  const page = req.query['p']

  const from = page == 0 ? page : size * page + 1
  let query = { match_all: {} }
  if (search) {
    query = {
      match: {
        name: search
      }
    }
  }
  const body = {
    size,
    from,
    query
  }
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
