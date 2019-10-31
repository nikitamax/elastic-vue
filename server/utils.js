function getSort(sortBy) {
  switch (sortBy) {
    case 'Price Low-High': {
      return {
        price: { order: 'asc' }
      }
    }
    case 'Price High-Low': {
      return {
        price: { order: 'desc' }
      }
    }
    default: {
      return {}
    }
  }
}

function getQuery(search) {
  if (search) {
    return {
      fuzzy: {
        name: {
          value: search,
          fuzziness: 2
        }
      }
    }
  }
  return { match_all: {} }
}

module.exports.getQuery = getQuery
module.exports.getSort = getSort
