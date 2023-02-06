module.exports = {
  htmlmin: {
      collapseWhitespace: false
  },
  pug: {
    pretty: true,
    client: false,
    data: {
      catalog: require('../data/catalog.json')
    }
  }
}