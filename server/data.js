const elasticsearch = require('elasticsearch')

const client = new elasticsearch.Client({
  hosts: ['http://localhost:9200']
})

client.indices.create(
  {
    index: 'elastic-vue-products'
  },
  function(error, response, status) {
    if (error) {
      console.log(error)
    } else {
      console.log('created a new index', response)
    }
  }
)

const products = require('./products.json')
var bulk = []
products.forEach(product => {
  bulk.push({
    index: {
      _index: 'elastic-vue-products',
      _type: 'products_list'
    }
  })
  bulk.push(product)
})

client.bulk({ body: bulk }, function(err, response) {
  if (err) {
    console.log('Failed Bulk operation', err)
  } else {
    console.log('Successfully imported %s', products.length)
  }
})
