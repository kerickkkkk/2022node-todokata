const errorHandler = (res, headers , message = '欄位錯誤或ID有誤') => {
  res.writeHead( 400, headers)
  res.write(JSON.stringify({
    "status" : 'false' ,
    message,
  }))
  res.end()
}

module.exports = errorHandler