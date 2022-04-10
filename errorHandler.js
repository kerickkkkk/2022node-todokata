const errorHandler = (res, headers) => {
  res.writeHead( 400, headers)
  res.write(JSON.stringify({
    "status" : 'false' ,
    "message" : "欄位錯誤或ID有誤",
  }))
  res.end()
}

module.exports = errorHandler