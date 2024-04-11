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
                dadosFilme.destaque == undefined          || dadosFilme.destaque.length > 5            ||
                dadosFilme.link_trailer == ''             || dadosFilme.link_trailer == undefined      || dadosFilme.link_trailer.length > 200      ||
                dadosFilme.id_classificacao == ''         || dadosFilme.id_classificacao == undefined  ||
                validacaoClassificacao.status == false  
             ){
                
                return message.ERROR_REQUIRED_FIELDS // 400
                
            }else{
                
                // if(dadosFilme.destaque == true){
                //     dadosFilme.removeDestaque()
                // }
                
                //Envia os dados para a model inserir no BD
                let novoFilme = await filmesDAO.insertFilme(dadosFilme)
                let id = await filmesDAO.selectLastId()
                
                dadosFilme.classificacao = validacaoClassificacao.classificacao[0].sigla
                dadosFilme.classificacao_indicativa = validacaoClassificacao.classificacao[0].classificacao_indicativa
                dadosFilme.id = Number(id[0].id)
                
                //Valida se o BD inseriu corretamente os dados
                if(novoFilme){

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
        
            //Validação para tratar campos obrigatórios e quantide de caracteres
            if( idFilme == ''                             || idFilme == undefined                      ||
                dadosFilme.nome == ''                     || dadosFilme.nome == undefined              || dadosFilme.nome.length > 80               ||
                dadosFilme.sinopse == ''                  || dadosFilme.sinopse == undefined           || dadosFilme.sinopse.length > 65535         || 
                dadosFilme.duracao == ''                  || dadosFilme.duracao == undefined           || dadosFilme.duracao.length > 8             || 
                dadosFilme.data_lancamento == ''          || dadosFilme.data_lancamento == undefined   || dadosFilme.data_lancamento.length > 10    || 
                dadosFilme.foto_capa == ''                || dadosFilme.foto_capa == undefined         || dadosFilme.foto_capa.length > 200         ||
                dadosFilme.valor_unitario.length > 5  
             ){
                
                return message.ERROR_REQUIRED_FIELDS // 400
                
            }else{
                
                let dadosValidated = false
        
                // Validação de digitação para data de relancamento que não é um campo obrigatório
                if  (   dadosFilme.data_relancamento != null &&
                        dadosFilme.data_relancamento != ''   &&
                        dadosFilme.data_relancamento != undefined 
                    ){    
        
                        if(dadosFilme.data_relancamento.length != 10)
                            return message.ERROR_REQUIRED_FIELDS // 400
                        else
                            dadosValidated = true
        
                } else {
                    dadosValidated = true
                }
        
                if(dadosValidated){
        
                    //Envia os dados para a model inserir no BD
                    let filmeAtualizado = await filmesDAO.updateFilme(dadosFilme, idFilme)
                                           
                    // Adiciona o ID do Filme no JSON para retornar
                    dadosFilme.id = idFilme

                    //Valida se o BD inseriu corretamente os dados
                    if(filmeAtualizado){
                        resultDadosFilme.status = message.UPDATED_ITEM.status
                        resultDadosFilme.status_code = message.UPDATED_ITEM.status_code
                        resultDadosFilme.message = message.UPDATED_ITEM.message
                        resultDadosFilme.filme = dadosFilme
                        return resultDadosFilme
                    }else {

                        return message.ERROR_INTERNAL_SERVER_DB // 500

                    }
        
        
                } else {

                    return message.ERROR_REQUIRED_FIELDS // 400

                }
                
            }
    
        }else{
            return message.ERROR_CONTENT_TYPE // 415
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
            
            let dadosFilme = await filmesDAO.deleteFilme(idFilme)

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
                    
                    // Montando o JSON para retornar o filme
                    filmeJSON.filme = dadosFilme
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
    getListarFilmes,
    getBuscarFilme,
    getFilmesNome
}