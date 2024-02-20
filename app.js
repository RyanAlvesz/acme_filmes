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

/************************ Imports de arquivos e bibliotecas do Projeto ************************/

    const controllerFilmes = require('./controller/controller_filme.js')

/**********************************************************************************************/

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

// EndPoints: Listar todos os filmes e suas informações
app.get('/v2/acme_filmes/filmes', cors(), async (request, response, next) => {

    let dadosFilmes = await controllerFilmes.getListarFilmes()

    response.status(dadosFilmes.status_code)
    response.json(dadosFilmes)

})

// EndPoints: Listar todos os filmes correspondentes com o filtro
app.get('/v2/acme_filmes/filmes/filtro', cors(), async (request, response, next) => {

    let filtro = request.query.nome

    let dadosFilmes = await controllerFilmes.getFilmesNome(filtro)

    response.status(dadosFilmes.status_code)
    response.json(dadosFilmes)

})

// EndPoint: Listar os dados do filme filtrando pelo id
app.get('/v2/acme_filmes/filme/:id', cors(), async (request, response, next) => {

    // Recebe o id da requisição
    let idFilme = request.params.id
    
    let dadosFilme = await controllerFilmes.getBuscarFilme(idFilme)
    
    response.status(dadosFilme.status_code);
    response.json(dadosFilme)

})

app.listen(8080, () => {})