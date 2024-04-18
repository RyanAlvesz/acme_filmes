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
*   npx prisma db pull
*   npx prisma generate
****************************************************************************************************************************************************/

// Import das bibliotecas do projeto
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const funcoes = require('./controller/funcoes.js')


/**************************** Imports de arquivos e bibliotecas do Projeto ******************************/
const controllerClassificacoes          = require('./controller/controller-classificacao.js')
const controllerFilmes                  = require('./controller/controller-filme.js')
const controllerDiretores               = require('./controller/controller-diretor.js')
const controllerFilmesDiretores         = require('./controller/controller-filme-diretor.js')
const controllerGeneros                 = require('./controller/controller-genero.js')
const controllerFilmesGeneros           = require('./controller/controller-filme-genero.js')
const controllerNacionalidades          = require('./controller/controller-nacionalidade.js')
const controllerAtores                  = require('./controller/controller-ator.js')
const controllerFilmesAtores            = require('./controller/controller-filme-ator.js')
const controllerNacionalidadesAtores    = require('./controller/controller-nacionalidade-ator.js')
const controllerUsuarios                = require('./controller/controller-usuario.js')
const controllerCategoriasFotoPerfil    = require('./controller/controller-categoria-foto-perfil.js')
const controllerFotosPerfil             = require('./controller/controller-foto-perfil.js')
const controllerPerfis                  = require('./controller/controller-perfil.js')
const controllerFilmesFavoritos         = require('./controller/controller-filme-favorito.js')
const controllerFuncionarios            = require('./controller/controller-funcionario.js')
/********************************************************************************************************/

// Cria um objeto app tendo como referência a classe do express
const app = express()

const bodyParserJson = bodyParser.json()

app.use((request, response, next) => {

    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Methods', '*')
    app.use(cors())
    next()

})

// #region V1


// EndPoint: Listar o id, nome e quantidade de filmes disponíveis
app.get('/v1/acme_filmes/filmes', async (request, response, next) => {
    response.json(funcoes.getListaFilmes())
    response.status(200)
})

// EndPoint: Listar informações de um filme específico
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



// #region CLASSIFICACOES

// EndPoint: Listar todas as classificações e suas informações
app.get('/v2/acme_filmes/classificacoes', cors(), async (request, response, next) => {

    let dadosClassificacoes = await controllerClassificacoes.getListarClassificacoes()
    response.status(dadosClassificacoes.status_code)
    response.json(dadosClassificacoes)

})

// EndPoint: Listar os dados da classificação filtrando pelo id
app.get('/v2/acme_filmes/classificacao/:id', cors(), async (request, response, next) => {

    let idClassificacao = request.params.id
    let dadosClassificacao = await controllerClassificacoes.getBuscarClassificacao(idClassificacao)
    response.status(dadosClassificacao.status_code);
    response.json(dadosClassificacao)

})

// EndPoint: Inserir novas classificações no Banco de Dados
app.post('/v2/acme_filmes/classificacao/', cors(), bodyParserJson, async (request, response, next) => {

    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let resultDados = await controllerClassificacoes.setNovaClassificacao(dadosBody, contentType)
    response.status(resultDados.status_code);
    response.json(resultDados)

})

// EndPoint: Deletar classificação por id
app.delete('/v2/acme_filmes/classificacao/:id', cors(), async (request, response, next) => {

    let idClassificacao = request.params.id
    let dadosClassificacao = await controllerClassificacoes.setExcluirClassificacao(idClassificacao)
    response.status(dadosClassificacao.status_code);
    response.json(dadosClassificacao)

})

// EndPoint: Atualizar classificação por id
app.put('/v2/acme_filmes/classificacao/:id', cors(), bodyParserJson, async (request, response, next) => {

    let idClassificacao = request.params.id
    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let resultDados = await controllerClassificacoes.setAtualizarClassificacao(dadosBody, contentType, idClassificacao)
    response.status(resultDados.status_code);
    response.json(resultDados)

})



// #region FILMES

// EndPoint: Listar todos os filmes e suas informações
app.get('/v2/acme_filmes/filmes', cors(), async (request, response, next) => {

    let dadosFilmes = await controllerFilmes.getListarFilmes()

    response.status(dadosFilmes.status_code)
    response.json(dadosFilmes)

})

// EndPoint: Listar os dados do filme filtrando pelo id
app.get('/v2/acme_filmes/filme/destaque/', cors(), async (request, response, next) => {
    
    let dadosFilme = await controllerFilmes.getListarFilmeDestaque()

    response.status(dadosFilme.status_code);
    response.json(dadosFilme)

})

// EndPoint: Listar todos os filmes ceorrespondentes com o filtro
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

// EndPoint: Listar filmes filtrando pelo id do ator
app.get('/v2/acme_filmes/filmes/ator/:id', cors(), async (request, response, next) => {

    // Recebe o id da requisição
    let idAtor = request.params.id
    
    let dadosFilme = await controllerFilmes.getListarFilmesAtor(idAtor)
    
    response.status(dadosFilme.status_code);
    response.json(dadosFilme)

})

// EndPoint: Listar filmes organizando por gênero
app.get('/v2/acme_filmes/filmes/generos/', cors(), async (request, response, next) => {

    let dadosFilmes = await controllerFilmes.getListarFilmesGenero()
    response.status(dadosFilmes.status_code)
    response.json(dadosFilmes)

})

// EndPoint: Listar filmes filtrando pelo id do ator
app.get('/v2/acme_filmes/filmes/perfil/:id', cors(), async (request, response, next) => {

    // Recebe o id da requisição
    let idPerfil = request.params.id
    
    let dadosFilme = await controllerFilmes.getListarFilmesFavoritosPerfil(idPerfil)
    
    response.status(dadosFilme.status_code);
    response.json(dadosFilme)

})

// EndPoint: Inserir novos filmes no Banco de Dados
// Não esquecer d ecolocar o bodyParserJSON que é quem define o formato de chegada dos dados
// Obs: esse objeto foi criado no inicio do projeto
app.post('/v2/acme_filmes/filme/', cors(), bodyParserJson, async (request, response, next) => {

    // Recebe o Content-Type da requisição (A API deve receber somente application/json)
    let contentType = request.headers['content-type']

    // Recebe os dados encaminhados na requisição do body (JSON)
    let dadosBody = request.body
    
    let resultDados = await controllerFilmes.setNovoFilme(dadosBody, contentType)
    
    response.status(resultDados.status_code);
    response.json(resultDados)

})

// EndPoint: Deletar filme por id
app.delete('/v2/acme_filmes/filme/:id', cors(), async (request, response, next) => {

    // Recebe o id da requisição
    let idFilme = request.params.id
    
    let dadosFilme = await controllerFilmes.setExcluirFilme(idFilme)
    
    response.status(dadosFilme.status_code);
    response.json(dadosFilme)

})

// EndPoint: Atualizar filme por id
app.put('/v2/acme_filmes/filme/:id', cors(), bodyParserJson, async (request, response, next) => {

    // Recebe o id da requisição
    let idFilme = request.params.id

    // Recebe o Content-Type da requisição (A API deve receber somente application/json)
    let contentType = request.headers['content-type']

    // Recebe os dados encaminhados na requisição do body (JSON)
    let dadosBody = request.body
    
    let resultDados = await controllerFilmes.setAtualizarFilme(dadosBody, contentType, idFilme)
    
    response.status(resultDados.status_code);
    response.json(resultDados)

})

// EndPoint: Adicionar destaque no filme por id
app.put('/v2/acme_filmes/filme/add_destaque/:id', cors(), async (request, response, next) => {

    // Recebe o id da requisição
    let idFilme = request.params.id    
    let dadosFilme = await controllerFilmes.setAdicionarDestaque(idFilme)
    
    response.status(dadosFilme.status_code);
    response.json(dadosFilme)

})

// EndPoint: Remover destaque no filme por id
app.put('/v2/acme_filmes/filme/rem_destaque/:id', cors(), async (request, response, next) => {

    // Recebe o id da requisição
    let idFilme = request.params.id
    
    let dadosFilme = await controllerFilmes.setRemoverDestaque(idFilme, false)
    
    response.status(dadosFilme.status_code);
    response.json(dadosFilme)

})



// #region DIRETORES

// EndPoint: Listar todos os diretores e suas informações
app.get('/v2/acme_filmes/diretores', cors(), async (request, response, next) => {

    let dadosDiretores = await controllerDiretores.getListarDiretores()
    response.status(dadosDiretores.status_code)
    response.json(dadosDiretores)

})

// EndPoint: Listar os dados do diretor filtrando pelo id
app.get('/v2/acme_filmes/diretor/:id', cors(), async (request, response, next) => {

    let idDiretor = request.params.id
    let dadosDiretor = await controllerDiretores.getBuscarDiretor(idDiretor)
    response.status(dadosDiretor.status_code);
    response.json(dadosDiretor)

})

// EndPoint: Listar os diretores de um filme filtrando pelo id
app.get('/v2/acme_filmes/diretores/filme/:id', cors(), async (request, response, next) => {

    let idFilme = request.params.id
    let dadosDiretor = await controllerDiretores.getListarDiretoresFilme(idFilme)
    response.status(dadosDiretor.status_code);
    response.json(dadosDiretor)

})

// EndPoint: Inserir novos diretores no Banco de Dados
app.post('/v2/acme_filmes/diretor/', cors(), bodyParserJson, async (request, response, next) => {

    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let resultDados = await controllerDiretores.setNovoDiretor(dadosBody, contentType)
    response.status(resultDados.status_code);
    response.json(resultDados)

})

// EndPoint: Deletar diretor por id
app.delete('/v2/acme_filmes/diretor/:id', cors(), async (request, response, next) => {

    let idDiretor = request.params.id
    let dadosDiretor = await controllerDiretores.setExcluirDiretor(idDiretor)
    response.status(dadosDiretor.status_code);
    response.json(dadosDiretor)

})

// EndPoint: Atualizar diretor por id
app.put('/v2/acme_filmes/diretor/:id', cors(), bodyParserJson, async (request, response, next) => {

    let idDiretor = request.params.id
    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let resultDados = await controllerDiretores.setAtualizarDiretor(dadosBody, contentType, idDiretor)
    response.status(resultDados.status_code);
    response.json(resultDados)

})



// #region FILMES E DIRETORES

// EndPoint: Listar todos as relações de filmes e diretores e suas informações
app.get('/v2/acme_filmes/filmes_diretores', cors(), async (request, response, next) => {

    let dadosFilmesDiretores = await controllerFilmesDiretores.getListarFilmesDiretores()
    response.status(dadosFilmesDiretores.status_code)
    response.json(dadosFilmesDiretores)

})

// EndPoint: Listar os dados da relação de filme e diretor filtrando pelo id
app.get('/v2/acme_filmes/filme_diretor/:id', cors(), async (request, response, next) => {

    let idFilmeDiretor = request.params.id
    let dadosFilmeDiretor = await controllerFilmesDiretores.getBuscarFilmeDiretor(idFilmeDiretor)
    response.status(dadosFilmeDiretor.status_code);
    response.json(dadosFilmeDiretor)

})

// EndPoint: Inserir novas relações de filme e diretores no Banco de Dados
app.post('/v2/acme_filmes/filme_diretor/', cors(), bodyParserJson, async (request, response, next) => {

    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let resultDados = await controllerFilmesDiretores.setNovoFilmeDiretor(dadosBody, contentType)
    response.status(resultDados.status_code);
    response.json(resultDados)

})

// EndPoint: Deletar diretor de um filme por id
app.delete('/v2/acme_filmes/filme_diretor/:id', cors(), async (request, response, next) => {

    let idFilmeDiretor = request.params.id
    let dadosFilmeDiretor = await controllerFilmesDiretores.setExcluirFilmeDiretor(idFilmeDiretor)
    response.status(dadosFilmeDiretor.status_code);
    response.json(dadosFilmeDiretor)

})

// EndPoint: Atualizar diretor de um filme por id
app.put('/v2/acme_filmes/filme_diretor/:id', cors(), bodyParserJson, async (request, response, next) => {

    let idFilmeDiretor = request.params.id
    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let resultDados = await controllerFilmesDiretores.setAtualizarFilmeDiretor(dadosBody, contentType, idFilmeDiretor)
    response.status(resultDados.status_code);
    response.json(resultDados)

})



// #region GÊNEROS

// EndPoint: Listar todos os gêneros e suas informações
app.get('/v2/acme_filmes/generos', cors(), async (request, response, next) => {

    let dadosGeneros = await controllerGeneros.getListarGeneros()
    response.status(dadosGeneros.status_code)
    response.json(dadosGeneros)

})

// EndPoint: Listar os dados do gênero filtrando pelo id
app.get('/v2/acme_filmes/genero/:id', cors(), async (request, response, next) => {

    let idGenero = request.params.id
    let dadosGenero = await controllerGeneros.getBuscarGenero(idGenero)
    response.status(dadosGenero.status_code);
    response.json(dadosGenero)

})

// EndPoint: Listar os gêneros de um filme filtrando pelo id
app.get('/v2/acme_filmes/generos/filme/:id', cors(), async (request, response, next) => {

    let idFilme = request.params.id
    let dadosGenero = await controllerGeneros.getListarGenerosFilme(idFilme)
    response.status(dadosGenero.status_code);
    response.json(dadosGenero)

})

// EndPoint: Inserir novos gêneros no Banco de Dados
app.post('/v2/acme_filmes/genero/', cors(), bodyParserJson, async (request, response, next) => {

    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let resultDados = await controllerGeneros.setNovoGenero(dadosBody, contentType)
    response.status(resultDados.status_code);
    response.json(resultDados)

})

// EndPoint: Deletar gênero por id
app.delete('/v2/acme_filmes/genero/:id', cors(), async (request, response, next) => {

    let idGenero = request.params.id
    let dadosGenero = await controllerGeneros.setExcluirGenero(idGenero)
    response.status(dadosGenero.status_code);
    response.json(dadosGenero)

})

// EndPoint: Atualizar gênero por id
app.put('/v2/acme_filmes/genero/:id', cors(), bodyParserJson, async (request, response, next) => {

    let idGenero = request.params.id
    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let resultDados = await controllerGeneros.setAtualizarGenero(dadosBody, contentType, idGenero)
    response.status(resultDados.status_code);
    response.json(resultDados)

})



// #region FILMES E GÊNEROS

// EndPoint: Listar todos as relações de filmes e gêneros e suas informações
app.get('/v2/acme_filmes/filmes_generos', cors(), async (request, response, next) => {

    let dadosFilmesGeneros = await controllerFilmesGeneros.getListarFilmesGeneros()
    response.status(dadosFilmesGeneros.status_code)
    response.json(dadosFilmesGeneros)

})

// EndPoint: Listar os dados da relação de filme e gênero filtrando pelo id
app.get('/v2/acme_filmes/filme_genero/:id', cors(), async (request, response, next) => {

    let idFilmeGenero = request.params.id
    let dadosFilmeGenero = await controllerFilmesGeneros.getBuscarFilmeGenero(idFilmeGenero)
    response.status(dadosFilmeGenero.status_code);
    response.json(dadosFilmeGenero)

})

// EndPoint: Inserir novas relações de filme e gêneros no Banco de Dados
app.post('/v2/acme_filmes/filme_genero/', cors(), bodyParserJson, async (request, response, next) => {

    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let resultDados = await controllerFilmesGeneros.setNovoFilmeGenero(dadosBody, contentType)
    response.status(resultDados.status_code);
    response.json(resultDados)

})

// EndPoint: Deletar gênero de um filme por id
app.delete('/v2/acme_filmes/filme_genero/:id', cors(), async (request, response, next) => {

    let idFilmeGenero = request.params.id
    let dadosFilmeGenero = await controllerFilmesGeneros.setExcluirFilmeGenero(idFilmeGenero)
    response.status(dadosFilmeGenero.status_code);
    response.json(dadosFilmeGenero)

})

// EndPoint: Atualizar gênero de um filme por id
app.put('/v2/acme_filmes/filme_genero/:id', cors(), bodyParserJson, async (request, response, next) => {

    let idFilmeGenero = request.params.id
    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let resultDados = await controllerFilmesGeneros.setAtualizarFilmeGenero(dadosBody, contentType, idFilmeGenero)
    response.status(resultDados.status_code);
    response.json(resultDados)

})



// #region NACIONALIDADES

// EndPoint: Listar todas as nacionalidades e suas informações
app.get('/v2/acme_filmes/nacionalidades', cors(), async (request, response, next) => {

    let dadosNacionalidades = await controllerNacionalidades.getListarNacionalidades()
    response.status(dadosNacionalidades.status_code)
    response.json(dadosNacionalidades)

})

// EndPoint: Listar os dados da nacionalidade filtrando pelo id
app.get('/v2/acme_filmes/nacionalidade/:id', cors(), async (request, response, next) => {

    let idNacionalidade = request.params.id
    let dadosNacionalidade = await controllerNacionalidades.getBuscarNacionalidade(idNacionalidade)
    response.status(dadosNacionalidade.status_code);
    response.json(dadosNacionalidade)

})

// EndPoint: Inserir novas nacionalidades no Banco de Dados
app.post('/v2/acme_filmes/nacionalidade/', cors(), bodyParserJson, async (request, response, next) => {

    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let resultDados = await controllerNacionalidades.setNovaNacionalidade(dadosBody, contentType)
    response.status(resultDados.status_code);
    response.json(resultDados)

})

// EndPoint: Deletar nacionalidade por id
app.delete('/v2/acme_filmes/nacionalidade/:id', cors(), async (request, response, next) => {

    let idNacionalidade = request.params.id
    let dadosNacionalidade = await controllerNacionalidades.setExcluirNacionalidade(idNacionalidade)
    response.status(dadosNacionalidade.status_code);
    response.json(dadosNacionalidade)

})

// EndPoint: Atualizar nacionalidade por id
app.put('/v2/acme_filmes/nacionalidade/:id', cors(), bodyParserJson, async (request, response, next) => {

    let idNacionalidade = request.params.id
    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let resultDados = await controllerNacionalidades.setAtualizarNacionalidade(dadosBody, contentType, idNacionalidade)
    response.status(resultDados.status_code);
    response.json(resultDados)

})



// #region ATORES

// EndPoint: Listar todos os atores e suas informações
app.get('/v2/acme_filmes/atores', cors(), async (request, response, next) => {

    let dadosAtores = await controllerAtores.getListarAtores()
    response.status(dadosAtores.status_code)
    response.json(dadosAtores)

})

// EndPoint: Listar os dados do ator filtrando pelo id
app.get('/v2/acme_filmes/ator/:id', cors(), async (request, response, next) => {

    let idAtor = request.params.id
    let dadosAtor = await controllerAtores.getBuscarAtor(idAtor)
    response.status(dadosAtor.status_code);
    response.json(dadosAtor)

})

// EndPoint: Listar os atores de um filme filtrando pelo id
app.get('/v2/acme_filmes/atores/filme/:id', cors(), async (request, response, next) => {

    let idFilme = request.params.id
    let dadosAtor = await controllerAtores.getListarAtoresFilme(idFilme)
    response.status(dadosAtor.status_code);
    response.json(dadosAtor)

})

// EndPoint: Inserir novos atores no Banco de Dados
app.post('/v2/acme_filmes/ator/', cors(), bodyParserJson, async (request, response, next) => {

    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let resultDados = await controllerAtores.setNovoAtor(dadosBody, contentType)
    response.status(resultDados.status_code);
    response.json(resultDados)

})

// EndPoint: Deletar ator por id
app.delete('/v2/acme_filmes/ator/:id', cors(), async (request, response, next) => {

    let idAtor = request.params.id
    let dadosAtor = await controllerAtores.setExcluirAtor(idAtor)
    response.status(dadosAtor.status_code);
    response.json(dadosAtor)

})

// EndPoint: Atualizar ator por id
app.put('/v2/acme_filmes/ator/:id', cors(), bodyParserJson, async (request, response, next) => {

    let idAtor = request.params.id
    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let resultDados = await controllerAtores.setAtualizarAtor(dadosBody, contentType, idAtor)
    response.status(resultDados.status_code);
    response.json(resultDados)

})



// #region FILMES E ATORES

// EndPoint: Listar todos as relações de filmes e atores e suas informações
app.get('/v2/acme_filmes/filmes_atores', cors(), async (request, response, next) => {

    let dadosFilmesAtores = await controllerFilmesAtores.getListarFilmesAtores()
    response.status(dadosFilmesAtores.status_code)
    response.json(dadosFilmesAtores)

})

// EndPoint: Listar os dados da relação de filme e ator filtrando pelo id
app.get('/v2/acme_filmes/filme_ator/:id', cors(), async (request, response, next) => {

    let idFilmeAtor = request.params.id
    let dadosFilmeAtor = await controllerFilmesAtores.getBuscarFilmeAtor(idFilmeAtor)
    response.status(dadosFilmeAtor.status_code);
    response.json(dadosFilmeAtor)

})

// EndPoint: Inserir novas relações de filme e atores no Banco de Dados
app.post('/v2/acme_filmes/filme_ator/', cors(), bodyParserJson, async (request, response, next) => {

    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let resultDados = await controllerFilmesAtores.setNovoFilmeAtor(dadosBody, contentType)
    response.status(resultDados.status_code);
    response.json(resultDados)

})

// EndPoint: Deletar ator de um filme por id
app.delete('/v2/acme_filmes/filme_ator/:id', cors(), async (request, response, next) => {

    let idFilmeAtor = request.params.id
    let dadosFilmeAtor = await controllerFilmesAtores.setExcluirFilmeAtor(idFilmeAtor)
    response.status(dadosFilmeAtor.status_code);
    response.json(dadosFilmeAtor)

})

// EndPoint: Atualizar ator de um filme por id
app.put('/v2/acme_filmes/filme_ator/:id', cors(), bodyParserJson, async (request, response, next) => {

    let idFilmeAtor = request.params.id
    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let resultDados = await controllerFilmesAtores.setAtualizarFilmeAtor(dadosBody, contentType, idFilmeAtor)
    response.status(resultDados.status_code);
    response.json(resultDados)

})



// #region NACIONALIDADES E ATORES

// EndPoint: Listar todos as relações de nacionalidades e atores e suas informações
app.get('/v2/acme_filmes/nacionalidades_atores', cors(), async (request, response, next) => {

    let dadosNacionalidadesAtores = await controllerNacionalidadesAtores.getListarNacionalidadesAtores()
    response.status(dadosNacionalidadesAtores.status_code)
    response.json(dadosNacionalidadesAtores)

})

// EndPoint: Listar os dados da relação de nacionalidade e ator filtrando pelo id
app.get('/v2/acme_filmes/nacionalidade_ator/:id', cors(), async (request, response, next) => {

    let idNacionalidadeAtor = request.params.id
    let dadosNacionalidadeAtor = await controllerNacionalidadesAtores.getBuscarNacionalidadeAtor(idNacionalidadeAtor)
    response.status(dadosNacionalidadeAtor.status_code);
    response.json(dadosNacionalidadeAtor)

})

// EndPoint: Inserir novas relações de nacionalidade e ator no Banco de Dados
app.post('/v2/acme_filmes/nacionalidade_ator/', cors(), bodyParserJson, async (request, response, next) => {

    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let resultDados = await controllerNacionalidadesAtores.setNovaNacionalidadeAtor(dadosBody, contentType)
    response.status(resultDados.status_code);
    response.json(resultDados)

})

// EndPoint: Deletar nacionalidade de um ator por id
app.delete('/v2/acme_filmes/nacionalidade_ator/:id', cors(), async (request, response, next) => {

    let idNacionalidadeAtor = request.params.id
    let dadosNacionalidadeAtor = await controllerNacionalidadesAtores.setExcluirNacionalidadeAtor(idNacionalidadeAtor)
    response.status(dadosNacionalidadeAtor.status_code);
    response.json(dadosNacionalidadeAtor)

})

// EndPoint: Atualizar nacionalidade de um ator por id
app.put('/v2/acme_filmes/nacionalidade_ator/:id', cors(), bodyParserJson, async (request, response, next) => {

    let idNacionalidadeAtor = request.params.id
    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let resultDados = await controllerNacionalidadesAtores.setAtualizarNacionalidadeAtor(dadosBody, contentType, idNacionalidadeAtor)
    response.status(resultDados.status_code);
    response.json(resultDados)

})



// #region USUÁRIOS

// EndPoint: Listar todos os usuários e suas informações
app.get('/v2/acme_filmes/usuarios', cors(), async (request, response, next) => {

    let dadosUsuarios = await controllerUsuarios.getListarUsuarios()
    response.status(dadosUsuarios.status_code)
    response.json(dadosUsuarios)

})

// EndPoint: Listar os dados do usuário filtrando pelo id
app.get('/v2/acme_filmes/usuario/:id', cors(), async (request, response, next) => {

    let idUsuario = request.params.id
    let dadosUsuario = await controllerUsuarios.getBuscarUsuario(idUsuario)
    response.status(dadosUsuario.status_code);
    response.json(dadosUsuario)

})

// EndPoint: Validar os dados do usuário
app.post('/v2/acme_filmes/validacao/usuario', cors(), bodyParserJson, async (request, response, next) => {

    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let dadosUsuario = await controllerUsuarios.getValidarUsuario(dadosBody.email, dadosBody.senha, contentType)
    response.status(dadosUsuario.status_code);
    response.json(dadosUsuario)

})

// EndPoint: Inserir novos usuários no Banco de Dados
app.post('/v2/acme_filmes/usuario/', cors(), bodyParserJson, async (request, response, next) => {

    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let resultDados = await controllerUsuarios.setNovoUsuario(dadosBody, contentType)
    response.status(resultDados.status_code);
    response.json(resultDados)

})

// EndPoint: Deletar usuário por id
app.delete('/v2/acme_filmes/usuario/:id', cors(), async (request, response, next) => {

    let idUsuario = request.params.id
    let dadosUsuario = await controllerUsuarios.setExcluirUsuario(idUsuario)
    response.status(dadosUsuario.status_code);
    response.json(dadosUsuario)

})

// EndPoint: Atualizar usuário por id
app.put('/v2/acme_filmes/usuario/:id', cors(), bodyParserJson, async (request, response, next) => {

    let idUsuario = request.params.id
    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let resultDados = await controllerUsuarios.setAtualizarUsuario(dadosBody, contentType, idUsuario)
    response.status(resultDados.status_code);
    response.json(resultDados)

})

// #region CATEGORIA DE FOTO DE PERFIL

// EndPoint: Listar todos as categorias de foto de perfil e suas informações
app.get('/v2/acme_filmes/categorias_foto_perfil', cors(), async (request, response, next) => {

    let dadosCategoriasFotoPerfil = await controllerCategoriasFotoPerfil.getListarCategoriasFotoPerfil()
    response.status(dadosCategoriasFotoPerfil.status_code)
    response.json(dadosCategoriasFotoPerfil)

})

// EndPoint: Listar os dados da categoria de foto de perfil filtrando pelo id
app.get('/v2/acme_filmes/categoria_foto_perfil/:id', cors(), async (request, response, next) => {

    let idCategoriaFotoPerfil = request.params.id
    let dadosCategoriaFotoPerfil = await controllerCategoriasFotoPerfil.getBuscarCategoriaFotoPerfil(idCategoriaFotoPerfil)
    response.status(dadosCategoriaFotoPerfil.status_code);
    response.json(dadosCategoriaFotoPerfil)

})

// EndPoint: Inserir novas categorias de foto de perfil no Banco de Dados
app.post('/v2/acme_filmes/categoria_foto_perfil/', cors(), bodyParserJson, async (request, response, next) => {

    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let resultDados = await controllerCategoriasFotoPerfil.setNovaCategoriaFotoPerfil(dadosBody, contentType)
    response.status(resultDados.status_code);
    response.json(resultDados)

})

// EndPoint: Deletar categoria de foto de perfil por id
app.delete('/v2/acme_filmes/categoria_foto_perfil/:id', cors(), async (request, response, next) => {

    let idCategoriaFotoPerfil = request.params.id
    let dadosCategoriaFotoPerfil = await controllerCategoriasFotoPerfil.setExcluirCategoriaFotoPerfil(idCategoriaFotoPerfil)
    response.status(dadosCategoriaFotoPerfil.status_code);
    response.json(dadosCategoriaFotoPerfil)

})

// EndPoint: Atualizar categoria de foto de perfil por id
app.put('/v2/acme_filmes/categoria_foto_perfil/:id', cors(), bodyParserJson, async (request, response, next) => {

    let idCategoriaFotoPerfil = request.params.id
    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let resultDados = await controllerCategoriasFotoPerfil.setAtualizarCategoriaFotoPerfil(dadosBody, contentType, idCategoriaFotoPerfil)
    response.status(resultDados.status_code);
    response.json(resultDados)

})


// #region FOTO DE PERFIL

// EndPoint: Listar todos as fotos de perfil e suas informações
app.get('/v2/acme_filmes/fotos_perfil', cors(), async (request, response, next) => {

    let dadosFotosPerfil = await controllerFotosPerfil.getListarFotosPerfil()
    response.status(dadosFotosPerfil.status_code)
    response.json(dadosFotosPerfil)

})

// EndPoint: Listar os dados da foto de perfil filtrando pelo id
app.get('/v2/acme_filmes/foto_perfil/:id', cors(), async (request, response, next) => {

    let idFotoPerfil = request.params.id
    let dadosFotoPerfil = await controllerFotosPerfil.getBuscarFotoPerfil(idFotoPerfil)
    response.status(dadosFotoPerfil.status_code);
    response.json(dadosFotoPerfil)

})

// EndPoint: Listar as fotos de perfil de uma categoria filtrando pelo id
app.get('/v2/acme_filmes/foto_perfil/categoria/:id', cors(), async (request, response, next) => {

    let idCategoria = request.params.id
    let dadosFotoPerfil = await controllerFotosPerfil.getListarFotosPerfilCategoria(idCategoria)
    response.status(dadosFotoPerfil.status_code);
    response.json(dadosFotoPerfil)

})

// EndPoint: Listar as fotos de perfil de todas as categoria
app.get('/v2/acme_filmes/fotos_perfil/categorias/', cors(), async (request, response, next) => {

    let dadosFotoPerfil = await controllerFotosPerfil.getListarFotosPerfilCategorias()
    response.status(dadosFotoPerfil.status_code);
    response.json(dadosFotoPerfil)

})

// EndPoint: Inserir novas fotos de perfil no Banco de Dados
app.post('/v2/acme_filmes/foto_perfil/', cors(), bodyParserJson, async (request, response, next) => {

    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let resultDados = await controllerFotosPerfil.setNovaFotoPerfil(dadosBody, contentType)
    response.status(resultDados.status_code);
    response.json(resultDados)

})

// EndPoint: Deletar foto de perfil por id
app.delete('/v2/acme_filmes/foto_perfil/:id', cors(), async (request, response, next) => {

    let idFotoPerfil = request.params.id
    let dadosFotoPerfil = await controllerFotosPerfil.setExcluirFotoPerfil(idFotoPerfil)
    response.status(dadosFotoPerfil.status_code);
    response.json(dadosFotoPerfil)

})

// EndPoint: Atualizar foto de perfil por id
app.put('/v2/acme_filmes/foto_perfil/:id', cors(), bodyParserJson, async (request, response, next) => {

    let idFotoPerfil = request.params.id
    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let resultDados = await controllerFotosPerfil.setAtualizarFotoPerfil(dadosBody, contentType, idFotoPerfil)
    response.status(resultDados.status_code);
    response.json(resultDados)

})



// #region PERFIL

// EndPoint: Listar todos perfis e suas informações
app.get('/v2/acme_filmes/perfis', cors(), async (request, response, next) => {

    let dadosPerfis = await controllerPerfis.getListarPerfis()
    response.status(dadosPerfis.status_code)
    response.json(dadosPerfis)

})

// EndPoint: Listar os dados de um perfil filtrando pelo id
app.get('/v2/acme_filmes/perfil/:id', cors(), async (request, response, next) => {

    let idPerfil = request.params.id
    let dadosPerfil = await controllerPerfis.getBuscarPerfil(idPerfil)
    response.status(dadosPerfil.status_code);
    response.json(dadosPerfil)

})

// EndPoint: Listar os todos os perfil de um usuário filtrando pelo id
app.get('/v2/acme_filmes/perfis/usuario/:id', cors(), async (request, response, next) => {

    let idUsuario = request.params.id
    let dadosPerfil = await controllerPerfis.getListarPerfisUsuario(idUsuario)
    response.status(dadosPerfil.status_code);
    response.json(dadosPerfil)

})

// EndPoint: Inserir novos perfis no Banco de Dados
app.post('/v2/acme_filmes/perfil/', cors(), bodyParserJson, async (request, response, next) => {

    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let resultDados = await controllerPerfis.setNovoPerfil(dadosBody, contentType)
    response.status(resultDados.status_code);
    response.json(resultDados)

})

// EndPoint: Deletar perfil por id
app.delete('/v2/acme_filmes/perfil/:id', cors(), async (request, response, next) => {

    let idPerfil = request.params.id
    let dadosPerfil = await controllerPerfis.setExcluirPerfil(idPerfil)
    response.status(dadosPerfil.status_code);
    response.json(dadosPerfil)

})

// EndPoint: Atualizar perfil por id
app.put('/v2/acme_filmes/perfil/:id', cors(), bodyParserJson, async (request, response, next) => {

    let idPerfil = request.params.id
    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let resultDados = await controllerPerfis.setAtualizarPerfil(dadosBody, contentType, idPerfil)
    response.status(resultDados.status_code);
    response.json(resultDados)

})



// #region FILME FAVORITO

// EndPoint: Listar todos os filmes favoritos e suas informações
app.get('/v2/acme_filmes/filmes_favoritos', cors(), async (request, response, next) => {

    let dadosFilmesFavoritos = await controllerFilmesFavoritos.getListarFilmesFavorito()
    response.status(dadosFilmesFavoritos.status_code)
    response.json(dadosFilmesFavoritos)

})

// EndPoint: Listar os dados do filme favorito filtrando pelo id
app.get('/v2/acme_filmes/filme_favorito/:id', cors(), async (request, response, next) => {

    let idFilmeFavorito = request.params.id
    let dadosFilmeFavorito = await controllerFilmesFavoritos.getBuscarFilmeFavorito(idFilmeFavorito)
    response.status(dadosFilmeFavorito.status_code);
    response.json(dadosFilmeFavorito)

})

// EndPoint: Inserir novos filmes favoritos no Banco de Dados
app.post('/v2/acme_filmes/filme_favorito/', cors(), bodyParserJson, async (request, response, next) => {

    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let resultDados = await controllerFilmesFavoritos.setNovoFilmeFavorito(dadosBody, contentType)
    response.status(resultDados.status_code);
    response.json(resultDados)

})

// EndPoint: Deletar filme favorito por id
app.delete('/v2/acme_filmes/filme_favorito/:id', cors(), async (request, response, next) => {

    let idFilmeFavorito = request.params.id
    let dadosFilmeFavorito = await controllerFilmesFavoritos.setExcluirFilmeFavorito(idFilmeFavorito)
    response.status(dadosFilmeFavorito.status_code);
    response.json(dadosFilmeFavorito)

})

// EndPoint: Atualizar filme favorito por id
app.put('/v2/acme_filmes/filme_favorito/:id', cors(), bodyParserJson, async (request, response, next) => {

    let idFilmeFavorito = request.params.id
    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let resultDados = await controllerFilmesFavoritos.setAtualizarFilmeFavorito(dadosBody, contentType, idFilmeFavorito)
    response.status(resultDados.status_code);
    response.json(resultDados)

})



// #region FUNCIONÁRIOS

// EndPoint: Listar todos os funcionários e suas informações
app.get('/v2/acme_filmes/funcionarios', cors(), async (request, response, next) => {

    let dadosFuncionarios = await controllerFuncionarios.getListarFuncionarios()
    response.status(dadosFuncionarios.status_code)
    response.json(dadosFuncionarios)

})

// EndPoint: Listar os dados do funcionario filtrando pelo id
app.get('/v2/acme_filmes/funcionario/:id', cors(), async (request, response, next) => {

    let idFuncionario = request.params.id
    let dadosFuncionario = await controllerFuncionarios.getBuscarFuncionario(idFuncionario)
    response.status(dadosFuncionario.status_code);
    response.json(dadosFuncionario)

})

// EndPoint: Validar os dados do funcionário
app.post('/v2/acme_filmes/validacao/funcionario', cors(), bodyParserJson, async (request, response, next) => {

    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let dadosFuncionario = await controllerFuncionarios.getValidarFuncionario(dadosBody.email, dadosBody.senha, contentType)
    response.status(dadosFuncionario.status_code);
    response.json(dadosFuncionario)

})

// EndPoint: Inserir novos funcionários no Banco de Dados
app.post('/v2/acme_filmes/funcionario/', cors(), bodyParserJson, async (request, response, next) => {

    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let resultDados = await controllerFuncionarios.setNovoFuncionario(dadosBody, contentType)
    response.status(resultDados.status_code);
    response.json(resultDados)

})

// EndPoint: Deletar funcionário por id
app.delete('/v2/acme_filmes/funcionario/:id', cors(), async (request, response, next) => {

    let idFuncionario = request.params.id
    let dadosFuncionario = await controllerFuncionarios.setExcluirFuncionario(idFuncionario)
    response.status(dadosFuncionario.status_code);
    response.json(dadosFuncionario)

})

// EndPoint: Atualizar funcionário por id
app.put('/v2/acme_filmes/funcionario/:id', cors(), bodyParserJson, async (request, response, next) => {

    let idFuncionario = request.params.id
    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let resultDados = await controllerFuncionarios.setAtualizarFuncionario(dadosBody, contentType, idFuncionario)
    response.status(resultDados.status_code);
    response.json(resultDados)

})


app.listen(8080, () => {console.log('API funcionando na porta 8080')})