const http = require('http')
const { v4 : uuidv4 } = require('uuid');
const { headers } = require('./constant')
const errorHandler = require('./errorHandler')

let todos = []

const requestHandler = (req, res) => {
  let body = ''
  req.on('data', chunk => {
    body += chunk
  })
  if( req.url === '/todos' && req.method === 'GET' ){
    res.writeHead(200, headers)
    res.write(JSON.stringify({
      "status" : "success",
      "message" : todos
    }))
    res.end()
  }else if( req.url === '/todos' && req.method === 'POST' ){
    req.on('end', () => {
      try {
        const { title } = JSON.parse(body)
        if(title){
          todos.push({
            id : uuidv4() , 
            title
          })
          res.writeHead(200, headers)
          res.write(JSON.stringify({
            "status" : "success",
            "message" : todos
          }))
          res.end()
        }else{
          errorHandler(res, headers, 'title 有誤')
        }
      } catch (error) {
        errorHandler(res, headers)
      }
    })

  }else if( req.url === '/todos' && req.method === 'DELETE' ){
    todos= []
    res.writeHead(200, headers)
    res.write(JSON.stringify({
      "status" : "success",
      "message" : "已清空所有 todos"
    }))
    res.end()
  }else if( req.url.startsWith('/todos/') && req.method === 'DELETE' ){
    const id = req.url.split('/').pop()
    const checkIdExist = todos.find(todo => todo.id === id)
    if(checkIdExist === true){
      const todoIndex = todos.findIndex( todo => todo.id === id)
      todos.splice(todoIndex, 1)
      res.writeHead(200, headers)
      res.write(JSON.stringify({
        "status" : "success",
        "message" : `已刪除 ${todos[todoIndex].title} 待辦`
      }))
      res.end()
    } else{
      errorHandler(res, headers, '請確認您輸入的id')
    }

  }else if( req.url.startsWith('/todos/') && req.method === 'PATCH' ){
    req.on('end', ()=>{
      try {
          const {title} = JSON.parse(body)
          if(title){
            const id = req.url.split('/').pop()
            const todoIndex = todos.findIndex( todo => todo.id === id)
            
            if( id !== undefined && todoIndex > -1){
              todos[todoIndex].title = title
    
              res.writeHead(200, headers)
              res.write(JSON.stringify({
                "status" : "success",
                "message" : `已修改 ${ id } 待辦`
              }))
              res.end()

            }else{
              errorHandler(res, headers)
            }
          }else{
            errorHandler(res, headers, 'title 有誤')
          }
      
      } catch (error) {
        errorHandler(res, headers)
      }
    })

  }else if (req.method === 'OPTION'){
    res.writeHead( 200, headers)
    res.end()
  }else{
    res.writeHead(404, headers)
    res.write(JSON.stringify({
      "status" : "false",
      "message" : "沒有此路由"
    }))
    res.end()
  }
}


const server = http.createServer(requestHandler)
// 設定 process.env 
server.listen( process.env.PORT || 8080 )
