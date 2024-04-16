/****************************************************************************************************************************************************
* Objetivo: Arquivo responsável pela interação entre o APP e a Model, que teremos todas as trativas e regras de negócio para o CRUD de filmes
* Data: 30/01/2024
* Autor: Ryan Alves
* Versão: 1.0
****************************************************************************************************************************************************/

// Import do arquivo DAO para manipular dados dos BD
const filmesDAO = require('../model/DAO/filme.js')

// Import do arquivo para mensagens
const message = require('../modulo/config.js')

// Import do controller de classificação para validação
const controllerClassificacoes = require('./controller-classificacao.js')

// Import dos controllers de ator, gênero e diretor para o select
const controllerAtores = require('./controller-ator.js')
const controllerGeneros = require('./controller-genero.js')
const controllerDiretores = require('./controller-diretor.js')

//Função para inserir um novo filme no Banco de Dados
const setNovoFilme = async(dadosFilme, contentType) => {

    try {
     
        if(String(contentType).toLowerCase() == 'application/json'){

            let resultDadosFilme = {}
            let validacaoClassificacao = await controllerClassificacoes.getBuscarClassificacao(dadosFilme.id_classificacao)

            //Validação para tratar campos obrigatórios e quantide de caracteres
            if( 
                dadosFilme.nome == ''                     || dadosFilme.nome == undefined              || dadosFilme.nome.length > 80               ||
                dadosFilme.sinopse == ''                  || dadosFilme.sinopse == undefined           || dadosFilme.sinopse.length > 65535         || 
                dadosFilme.duracao == ''                  || dadosFilme.duracao == undefined           || dadosFilme.duracao.length > 8             || 
                dadosFilme.data_lancamento == ''          || dadosFilme.data_lancamento == undefined   || dadosFilme.data_lancamento.length > 10    || 
                dadosFilme.foto_capa == ''                || dadosFilme.foto_capa == undefined         || dadosFilme.foto_capa.length > 65535       ||
                dadosFilme.foto_banner == ''              || dadosFilme.foto_banner == undefined       || dadosFilme.foto_banner.length > 65535     ||
                dadosFilme.destaque == undefined          || dadosFilme.destaque.length > 1            ||
                dadosFilme.link_trailer == ''             || dadosFilme.link_trailer == undefined      || dadosFilme.link_trailer.length > 200      ||
                dadosFilme.id_classificacao == ''         || dadosFilme.id_classificacao == undefined  ||
                validacaoClassificacao.status == false  
             ){
                
                return message.ERROR_REQUIRED_FIELDS // 400
                
            }else{

                let destaque = await filmesDAO.selectIdDestaque()

                // Verificando se existe um filme em destaque
                if(destaque.length > 0){
                
                    let idDestaque = destaque[0].id

                    // Removendo destaque do filme destacado (mínimo 1 destaque)
                    if(dadosFilme.destaque == true || dadosFilme.destaque == 1){
                        await setRemoverDestaque(idDestaque, true)
                    }

                }

                //Envia os dados para a model inserir no BD
                let novoFilme = await filmesDAO.insertFilme(dadosFilme)
                
                //Valida se o BD inseriu corretamente os dados
                if(novoFilme){
                    
                    let id = await filmesDAO.selectLastId()
                    
                    // Adiciona a classificação do Filme no JSON para retornar
                    dadosFilme.classificacao = validacaoClassificacao.classificacao[0].sigla
                    dadosFilme.classificacao_indicativa = validacaoClassificacao.classificacao[0].classificacao_indicativa
    
                    // Adiciona o ID do Filme no JSON para retornar
                    dadosFilme.id = Number(id[0].id)

                    resultDadosFilme.status = message.CREATED_ITEM.status
                    resultDadosFilme.status_code = message.CREATED_ITEM.status_code
                    resultDadosFilme.message = message.CREATED_ITEM.message
                    resultDadosFilme.filme = dadosFilme
                    return resultDadosFilme

                }else {

                    return message.ERROR_INTERNAL_SERVER_DB // 500

                }
                
            }
    
        }else{
            return message.ERROR_CONTENT_TYPE // 415
        }

    } catch (error) {
        return message.ERROR_INTERNAL_SERVER // 500
    }

}

//Função para atualizar um filme existente
const setAtualizarFilme = async(dadosFilme, contentType, idFilme) => {

    try {
        
        if(String(contentType).toLowerCase() == 'application/json'){

            let resultDadosFilme = {}
            let validacaoClassificacao = await controllerClassificacoes.getBuscarClassificacao(dadosFilme.id_classificacao)
        
            //Validação para tratar campos obrigatórios e quantide de caracteres
            if( 
                idFilme == ''                             || idFilme == undefined                      ||
                dadosFilme.nome == ''                     || dadosFilme.nome == undefined              || dadosFilme.nome.length > 80               ||
                dadosFilme.sinopse == ''                  || dadosFilme.sinopse == undefined           || dadosFilme.sinopse.length > 65535         || 
                dadosFilme.duracao == ''                  || dadosFilme.duracao == undefined           || dadosFilme.duracao.length > 8             || 
                dadosFilme.data_lancamento == ''          || dadosFilme.data_lancamento == undefined   || dadosFilme.data_lancamento.length > 10    || 
                dadosFilme.foto_capa == ''                || dadosFilme.foto_capa == undefined         || dadosFilme.foto_capa.length > 65535       ||
                dadosFilme.foto_banner == ''              || dadosFilme.foto_banner == undefined       || dadosFilme.foto_banner.length > 65535     ||
                dadosFilme.destaque == undefined          || dadosFilme.destaque.length > 1            ||
                dadosFilme.link_trailer == ''             || dadosFilme.link_trailer == undefined      || dadosFilme.link_trailer.length > 200      ||
                dadosFilme.id_classificacao == ''         || dadosFilme.id_classificacao == undefined  ||
                validacaoClassificacao.status == false   
            ){
                
                return message.ERROR_REQUIRED_FIELDS // 400
                
            }else{

                let destaque = await filmesDAO.selectIdDestaque()

                // Verificando se existe um filme em destaque
                if(destaque.length > 0){
                
                    let idDestaque = destaque[0].id

                    // Removendo destaque do filme destacado se o filme atualizado tiver destaque 
                    if(dadosFilme.destaque == true || dadosFilme.destaque == 1){
                        if(idDestaque != idFilme){
                            await setRemoverDestaque(idDestaque, true)
                        }
                    }

                    // Adicionando destaque no primeiro filme caso seja removido o destaque do filme 
                    if(dadosFilme.destaque == false || dadosFilme.destaque == 0){
                        if(idDestaque == idFilme){
                            let primeiroFilme = await filmesDAO.selectMinId()
                            let primeiroFilmeId = primeiroFilme[0].id
                            await setAdicionarDestaque(primeiroFilmeId)    
                        }                        
                    }

                }
                
                //Envia os dados para a model inserir no BD
                let filmeAtualizado = await filmesDAO.updateFilme(dadosFilme, idFilme)

                //Valida se o BD inseriu corretamente os dados
                if(filmeAtualizado){
                                            
                    // Adiciona a classificação do Filme no JSON para retornar
                    dadosFilme.classificacao = validacaoClassificacao.classificacao[0].sigla
                    dadosFilme.classificacao_indicativa = validacaoClassificacao.classificacao[0].classificacao_indicativa
    
                    // Adiciona o ID do Filme no JSON para retornar
                    dadosFilme.id = idFilme

                    resultDadosFilme.status = message.UPDATED_ITEM.status
                    resultDadosFilme.status_code = message.UPDATED_ITEM.status_code
                    resultDadosFilme.message = message.UPDATED_ITEM.message
                    resultDadosFilme.filme = dadosFilme
                    return resultDadosFilme

                }else {

                    return message.ERROR_INTERNAL_SERVER_DB // 500

                }
                
            }
    
        }else{
            return message.ERROR_CONTENT_TYPE // 415
        }

    } catch (error) {
        message.ERROR_INTERNAL_SERVER // 500
    }

}

//Função para adicionar destaque para um filme
const setAdicionarDestaque = async(idFilme) => {

    try {
        
        let resultDadosFilme = {}
    
        //Validação para tratar campos obrigatórios
        if(idFilme == '' || idFilme == undefined){
            
            return message.ERROR_REQUIRED_FIELDS // 400
            
        }else{

            let destaque = await filmesDAO.selectIdDestaque()

            // Verificando se existe um filme em destaque
            if(destaque.length > 0){

                let idDestaque = destaque[0].id

                // Removendo destaque do filme destacado
                if(idDestaque != idFilme){
                    await setRemoverDestaque(idDestaque, true)
                }
            
            }

            //Envia os dados para a model inserir no BD
            let validacaoUpdate = await filmesDAO.updateAdicionarDestaque(idFilme)

            //Valida se o BD inseriu corretamente os dados
            if(validacaoUpdate){

                let filme = await getBuscarFilme(idFilme)

                resultDadosFilme.status = message.UPDATED_ITEM.status
                resultDadosFilme.status_code = message.UPDATED_ITEM.status_code
                resultDadosFilme.message = message.UPDATED_ITEM.message
                resultDadosFilme.filme = filme.filme[0]
                return resultDadosFilme

            }else {

                return message.ERROR_INTERNAL_SERVER_DB // 500

            }
            
        }

    } catch (error) {
        message.ERROR_INTERNAL_SERVER // 500
    }

}

//Função para adicionar destaque para um filme
const setRemoverDestaque = async(idFilme, novoFilmeDestaque) => {

    try {
        
        let resultDadosFilme = {}
    
        //Validação para tratar campos obrigatórios
        if(idFilme == '' || idFilme == undefined){
            
            return message.ERROR_REQUIRED_FIELDS // 400
            
        }else{
            
            //Envia os dados para a model inserir no BD
            let validacaoUpdate = await filmesDAO.updateRemoverDestaque(idFilme)
            
            //Valida se o BD inseriu corretamente os dados
            if(validacaoUpdate){
                
                if(novoFilmeDestaque == false){
                    
                    let primeiroFilme = await filmesDAO.selectMinId()
                    let primeiroFilmeId = primeiroFilme[0].id
                    await setAdicionarDestaque(primeiroFilmeId)

                }

                let filme = await getBuscarFilme(idFilme)

                resultDadosFilme.status = message.UPDATED_ITEM.status
                resultDadosFilme.status_code = message.UPDATED_ITEM.status_code
                resultDadosFilme.message = message.UPDATED_ITEM.message
                resultDadosFilme.filme = filme.filme[0]
                return resultDadosFilme

            }else {

                return message.ERROR_INTERNAL_SERVER_DB // 500

            }
            
        }

    } catch (error) {
        message.ERROR_INTERNAL_SERVER // 500
    }

}

//Função para excluir um filme existente
const setExcluirFilme = async(id) => {

    try {
        
        //Recebe o id do filme
        let idFilme = id

        let validacaoFilmes = await getBuscarFilme(idFilme)

        // Validação para ID vazio, indefinido
        if(idFilme == '' || idFilme == undefined || isNaN(idFilme)){

            return message.ERROR_INVALID_ID // 400

        // Validação se o item existe 
        } else if (validacaoFilmes.status == false) {
            
            return message.ERROR_NOT_FOUND // 404

        } else {
            
            let destaque = await filmesDAO.selectIdDestaque()
            let dadosFilme = await filmesDAO.deleteFilme(idFilme)

            // Verificando se existe um filme em destaque
            if(destaque.length > 0){
                
                let idDestaque = destaque[0].id

                if(idDestaque == idFilme){
                    let primeiroFilme = await filmesDAO.selectMinId()
                    let primeiroFilmeId = primeiroFilme[0].id
                    await setAdicionarDestaque(primeiroFilmeId)
                }

            }

            // Validação para verificar se os dados no servidor foram processados
            if(dadosFilme){                
                    
                return message.DELETED_ITEM // 200

            } else {

                return message.ERROR_INTERNAL_SERVER_DB // 500

            }

        }

    } catch (error) {
        message.ERROR_INTERNAL_SERVER // 500
    }

}

//Função para retornar todos os filmes do Banco de Dados
const getListarFilmes = async() => {

    try {

        // Cria a variável do tipo JSON     
        let filmesJSON = {}

        // Chama a função do DAO para buscar os dados do BD
        let dadosFilmes = await filmesDAO.selectAllFilmes()
        
        // Verifica se existem dados retornados
        if(dadosFilmes){
            
            if(dadosFilmes.length > 0) {
                
                // Adicionando os gêneros, diretores e atores dos filmes no JSON de cada filme
                const promisse = dadosFilmes.map(async (filme) => {
                    let generos = await controllerGeneros.getListarGenerosFilme(filme.id)
                    if(generos.status_code == 200){
                        filme.generos = generos.generos     
                    }
                    let diretores = await controllerDiretores.getListarDiretoresFilme(filme.id)
                    if(diretores.status_code == 200){
                        filme.diretores = diretores.diretores     
                    }
                    let atores = await controllerAtores.getListarAtoresFilme(filme.id)
                    if(atores.status_code == 200){
                        filme.atores = atores.atores     
                    }
                })
                
                await Promise.all(promisse)

                // Montando o JSON para retornar 
                filmesJSON.filmes = dadosFilmes
                filmesJSON.quantidade = dadosFilmes.length
                filmesJSON.status_code = 200
                // Retorna o JSON montado
                return filmesJSON
            
            }else{

                return message.ERROR_NOT_FOUND // 404

            }
    
    
        }else{
            
            // Retorna falso quando não houver dados
            return message.ERROR_INTERNAL_SERVER_DB // 500
    
        }
      
    } catch (error) {
        message.ERROR_INTERNAL_SERVER // 500
    }

}

// Função para retornar todos os filmes correspondentes do filtro
const getFilmesNome = async(filtro) => {

    try {
    
        // Cria a variável do tipo JSON     
    let filmesJSON = {}

    // Recebendo o parâmetro de pesquisa
    let nome = filtro

    if(nome == '' || nome == undefined){

        return message.ERROR_REQUIRED_FIELDS // 400

    }else{

        // Chama a função do DAO para buscar os dados do BD
        let dadosFilmes = await filmesDAO.selectByName(nome)

        // Verifica se existem dados retornados
        if(dadosFilmes){

            if(dadosFilmes.length > 0){

                // Adicionando os gêneros, diretores e atores dos filmes no JSON de cada filme
                const promisse = dadosFilmes.map(async (filme) => {
                    let generos = await controllerGeneros.getListarGenerosFilme(filme.id)
                    if(generos.status_code == 200){
                        filme.generos = generos.generos     
                    }
                    let diretores = await controllerDiretores.getListarDiretoresFilme(filme.id)
                    if(diretores.status_code == 200){
                        filme.diretores = diretores.diretores     
                    }
                    let atores = await controllerAtores.getListarAtoresFilme(filme.id)
                    if(atores.status_code == 200){
                        filme.atores = atores.atores     
                    } 
                })
                
                await Promise.all(promisse)
                
                // Montando o JSON para retornar 
                filmesJSON.filmes = dadosFilmes
                filmesJSON.quantidade = dadosFilmes.length
                filmesJSON.status_code = 200
                // Retorna o JSON montado
                return filmesJSON
            
            } else {

                return message.ERROR_NOT_FOUND // 404

            }

        }else{
            
            return message.ERROR_INTERNAL_SERVER_DB // 500

        }

    }
        
    } catch (error) {
        message.ERROR_INTERNAL_SERVER // 500
    }

}

//Função para buscar filme pelo id
const getBuscarFilme = async(id) => {

    try {
        
        //Recebe o id do filme
        let idFilme = id
        let filmeJSON = {}

        // Validação para ID vazio, indefinido
        if(idFilme == '' || idFilme == undefined || isNaN(idFilme)){

            return message.ERROR_INVALID_ID // 400

        } else {

            let dadosFilme = await filmesDAO.selectByIdFilme(idFilme)
            
            // Validação para verificar se os dados no servidor foram processados
            if(dadosFilme){

                // Validação para verificar se existem dados de retorno
                if(dadosFilme.length > 0){
                    
                    // Adicionando gêneros, diretores e atores do filme
                    let generos = await controllerGeneros.getListarGenerosFilme(idFilme)
                    let diretores = await controllerDiretores.getListarDiretoresFilme(idFilme)
                    let atores = await controllerAtores.getListarAtoresFilme(idFilme)
                    
                    if(generos.status_code == 200){
                        dadosFilme[0].generos = generos.generos
                    }
                    
                    if(diretores.status_code == 200){
                        dadosFilme[0].diretores = diretores.diretores
                    }
                    
                    if(atores.status_code == 200){
                        dadosFilme[0].atores = atores.atores
                    }

                    // Montando o JSON para retornar o filme
                    filmeJSON.filme = dadosFilme
                    filmeJSON.quantidade = dadosFilme.length
                    filmeJSON.status_code = 200
                    // Retorna o JSON montado
                    return filmeJSON

                }else{

                    return message.ERROR_NOT_FOUND // 404

                }

            } else {

                return message.ERROR_INTERNAL_SERVER_DB // 500

            }

        }

    } catch (error) {
        message.ERROR_INTERNAL_SERVER // 500
    }

}

//Função para buscar filme em destaque pelo id
const getListarFilmeDestaque = async() => {

    try {
        
        //Recebe o id do filme
        let id = await filmesDAO.selectIdDestaque()
        let filmeJSON = {}

        // Validação para verificar se os dados no servidor foram processados
        if(id){
            
            // Validação para verificar se existem dados de retorno
            if(id.length > 0){
                
                let filme = await getBuscarFilme(id[0].id)
                
                // Montando o JSON para retornar o filme
                filmeJSON.filme = filme.filme[0]
                filmeJSON.status_code = 200
                // Retorna o JSON montado
                return filmeJSON

            }else{

                return message.ERROR_NOT_FOUND // 404

            }

        } else {

            return message.ERROR_INTERNAL_SERVER_DB // 500

        }

    } catch (error) {
        message.ERROR_INTERNAL_SERVER // 500
    }

}

//Função para listar filmes de um ator pelo id
const getListarFilmesAtor = async(id) => {

    try {
        
        //Recebe o id do ator
        let idAtor = id
        let filmeJSON = {}

        // Validação para ID vazio, indefinido
        if(idAtor == '' || idAtor == undefined || isNaN(idAtor)){

            return message.ERROR_INVALID_ID // 400

        } else {

            let dadosFilme = await filmesDAO.selectAllFilmesByAtor(idAtor)

            // Validação para verificar se os dados no servidor foram processados
            if(dadosFilme){

                // Validação para verificar se existem dados de retorno
                if(dadosFilme.length > 0){

                    // Adicionando os gêneros, diretores e atores dos filmes no JSON de cada filme
                    const promisse = dadosFilme.map(async (filme) => {
                        let generos = await controllerGeneros.getListarGenerosFilme(filme.id)
                        if(generos.status_code == 200){
                            filme.generos = generos.generos     
                        }
                        let diretores = await controllerDiretores.getListarDiretoresFilme(filme.id)
                        if(diretores.status_code == 200){
                            filme.diretores = diretores.diretores     
                        }
                        let atores = await controllerAtores.getListarAtoresFilme(filme.id)
                        if(atores.status_code == 200){
                            filme.atores = atores.atores     
                        } 
                    })

                    await Promise.all(promisse)
                    
                    // Montando o JSON para retornar os filmes
                    filmeJSON.filmes = dadosFilme
                    filmeJSON.quantidade = dadosFilme.length
                    filmeJSON.status_code = 200
                    // Retorna o JSON montado
                    return filmeJSON

                }else{

                    return message.ERROR_NOT_FOUND // 404

                }

            } else {

                return message.ERROR_INTERNAL_SERVER_DB // 500

            }

        }

    } catch (error) {
        message.ERROR_INTERNAL_SERVER // 500
    }

}

//Função para listar filmes de um gênero
const getListarFilmesGenero = async() => {

    try {
    
        let filmeJSON = {}
        let dadosGeneros = []

        let generosJSON = await controllerGeneros.getListarGeneros()

        // Validação para verificar se os dados no servidor foram processados
        if(generosJSON){

            // Validação para verificar se existem dados de retorno
            if(generosJSON.generos.length > 0){
                
                const promisse = generosJSON.generos.map(async (genero) => {
                
                    let filmesARRAY = await filmesDAO.selectAllFilmesByGenero(genero.id)
                    
                    if (filmesARRAY){
                        let filmesGenero = {
                            genero: genero.nome,
                            id_genero: genero.id,
                            filmes: filmesARRAY,
                            quantidade_filmes: filmesARRAY.length
                        }
                        dadosGeneros.push(filmesGenero)
                    }
        
                })
                
                await Promise.all(promisse)

                // Montando o JSON para retornar os filmes
                filmeJSON.generos = dadosGeneros
                filmeJSON.status_code = 200
                // Retorna o JSON montado
                return filmeJSON

            }else{

                return message.ERROR_NOT_FOUND // 404

            }

        } else {

            return message.ERROR_INTERNAL_SERVER_DB // 500

        }
        

    } catch (error) {
        message.ERROR_INTERNAL_SERVER // 500
    }

}

//Função para listar todos os filmes favoritos de um perfil pelo id
const getListarFilmesFavoritosPerfil = async(id) => {

    try {
        
        //Recebe o id do perfil
        let idPerfil = id
        let filmeJSON = {}

        // Validação para ID vazio, indefinido
        if(idPerfil == '' || idPerfil == undefined || isNaN(idPerfil)){

            return message.ERROR_INVALID_ID // 400

        } else {

            let dadosFilme = await filmesDAO.selectAllFilmesFavoritosByPerfil(idPerfil)

            // Validação para verificar se os dados no servidor foram processados
            if(dadosFilme){

                // Validação para verificar se existem dados de retorno
                if(dadosFilme.length > 0){
                    
                    // Montando o JSON para retornar os filmes
                    filmeJSON.filmes = dadosFilme
                    filmeJSON.status_code = 200
                    // Retorna o JSON montado
                    return filmeJSON

                }else{

                    return message.ERROR_NOT_FOUND // 404

                }

            } else {

                return message.ERROR_INTERNAL_SERVER_DB // 500

            }

        }

    } catch (error) {
        message.ERROR_INTERNAL_SERVER // 500
    }

}

module.exports = {
    setNovoFilme,
    setAtualizarFilme,
    setExcluirFilme,
    setAdicionarDestaque,
    setRemoverDestaque,
    getListarFilmes,
    getListarFilmeDestaque,
    getListarFilmesAtor,
    getListarFilmesGenero,
    getListarFilmesFavoritosPerfil,
    getBuscarFilme,
    getFilmesNome
}