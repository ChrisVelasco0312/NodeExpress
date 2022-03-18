// print normal log messages
const info = (...params) => {
  console.log(...params)
}

// printing all error messages
const error = (...params) => {
  console.error(...params)
}

module.exports = {
  info, error
}