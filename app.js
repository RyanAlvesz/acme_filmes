/****************************************************************************************************************************************************
* Objetivo: Cria uma API para respoder dados de uma empresa de filmes online
* Data: 23/01/2024
* Autor: Ryan Alves
* Versão: 1.0
****************************************************************************************************************************************************/

/****************************************************************************************************************************************************
* Para realizar a conexão com o Banco de Dados precisamos utilizar uma dependência:  
*  - SEQUELIZE ORM
*  - PRISMA    ORM
*  - FASTIFY    ORM
*
* Prisma - Dependências:
*   npm install prisma --save
*   npm install @prisma/client --save
*   
* Comando para incialização o prisma
*   npx prisma init
****************************************************************************************************************************************************/

// Import das bibliotecas do projeto
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const funcoes = require('./controller/funcoes.js')

// Cria um objeto app tendo como referência a classe do express
const app = express()

app.use((request, response, next) => {

    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Methods', 'GET, POST')
    app.use(cors)
    next()

})

// EndPoints: Listar o id, nome e quantidade de filmes disponíveis
app.get('/v1/acme_filmes/filmes', async (request, response, next) => {
    response.json(funcoes.getListaFilmes())
    response.status(200)
})

// EndPoints: Listar informações de um filme específico
app.get('/v1/acme_filmes/filme/:id', async (request, response, next) => {

    let id = request.params.id

    if(funcoes.getFilme(id)){
        response.json(funcoes.getFilme(id))
        response.status(200)
    }else{
        response.json({erro: 'Não foi possível encontrar um item'})
        response.status(404)
    }

})

app.listen(8080, () => {})