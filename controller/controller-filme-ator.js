/****************************************************************************************************************************************************
* Objetivo: Arquivo responsável pela interação entre o APP e a Model, que teremos todas as trativas e regras de negócio para o CRUD da relação de filmes e atores
* Data: 09/04/2024
* Autor: Ryan Alves
* Versão: 1.0
****************************************************************************************************************************************************/

const filmesAtoresDAO = require('../model/DAO/filme-ator.js')
const message = require('../modulo/config.js')

const controllerFilmes = require('./controller-filme.js')
const controllerAtores = require('./controller-ator.js')

//Função para inserir uma nova relação de filme e ator no Banco de Dados
const setNovoFilmeAtor = async(dadosFilmeAtor, contentType) => {

    try {
     
        if(String(contentType).toLowerCase() == 'application/json'){

            let resultDadosFilmeAtor = {}

            let filme = await controllerFilmes.getBuscarFilme(dadosFilmeAtor.id_filme)
            let ator = await controllerAtores.getBuscarAtor(dadosFilmeAtor.id_ator)

            if(
                dadosFilmeAtor.id_filme == '' || dadosFilmeAtor.id_filme == undefined ||
                dadosFilmeAtor.id_ator == ''  || dadosFilmeAtor.id_ator == undefined  ||
                filme.status == false         ||
                ator.status == false                 
            ){

                return message.ERROR_REQUIRED_FIELDS // 400  

            }else{

                //Envia os dados para a model inserir no BD
                let novoFilmeAtor = await filmesAtoresDAO.insertFilmeAtor(dadosFilmeAtor)
                
                let id = await filmesAtoresDAO.selectLastId()
                
                dadosFilmeAtor.filme = filme.filme[0].nome
                dadosFilmeAtor.ator = ator.ator[0].nome
                dadosFilmeAtor.id = Number(id[0].id)
                
                //Valida se o BD inseriu corretamente os dados
                if(novoFilmeAtor){

                    resultDadosFilmeAtor.status = message.CREATED_ITEM.status
                    resultDadosFilmeAtor.status_code = message.CREATED_ITEM.status_code
                    resultDadosFilmeAtor.message = message.CREATED_ITEM.message
                    resultDadosFilmeAtor.filme_ator = dadosFilmeAtor
                    return resultDadosFilmeAtor

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

//Função para atualizar uma relação de filme e ator existente
const setAtualizarFilmeAtor = async(dadosFilmeAtor, contentType, idFilmeAtor) => {

    try {
        
        if(String(contentType).toLowerCase() == 'application/json'){

            let resultDadosFilmeAtor = {}

            let filme = await controllerFilmes.getBuscarFilme(dadosFilmeAtor.id_filme)
            let ator = await controllerAtores.getBuscarAtor(dadosFilmeAtor.id_ator)
        
            if( 
                idFilmeAtor == ''             || idFilmeAtor == undefined             ||
                dadosFilmeAtor.id_filme == '' || dadosFilmeAtor.id_filme == undefined ||
                dadosFilmeAtor.id_ator == ''  || dadosFilmeAtor.id_ator == undefined  ||
                filme.status == false         ||
                ator.status == false         
            ){
                
                return message.ERROR_REQUIRED_FIELDS // 400
                
            }else{
                
                let filmeAtorAtualizado = await filmesAtoresDAO.updateFilmeAtor(dadosFilmeAtor, idFilmeAtor)
                                        
                dadosFilmeAtor.filme = filme.filme[0].nome
                dadosFilmeAtor.ator = ator.ator[0].nome
                dadosFilmeAtor.id = idFilmeAtor

                if(filmeAtorAtualizado){
                    resultDadosFilmeAtor.status = message.UPDATED_ITEM.status
                    resultDadosFilmeAtor.status_code = message.UPDATED_ITEM.status_code
                    resultDadosFilmeAtor.message = message.UPDATED_ITEM.message
                    resultDadosFilmeAtor.filme_ator = dadosFilmeAtor
                    return resultDadosFilmeAtor
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

//Função para excluir uma relação de filme e ator existente
const setExcluirFilmeAtor = async(id) => {

    try {
        
        let idFilmeAtor = id
        let validacaoFilmeAtor = await getBuscarFilmeAtor(idFilmeAtor)

        if(idFilmeAtor == '' || idFilmeAtor == undefined || isNaN(idFilmeAtor)){
            
            return message.ERROR_INVALID_ID // 400
            
        } else if (validacaoFilmeAtor.status == false) {
            
            return message.ERROR_NOT_FOUND // 404
            
        } else {
            
            let dadosFilmeAtor = await filmesAtoresDAO.deleteFilmeAtor(idFilmeAtor)
            
            if(dadosFilmeAtor){                
                return message.DELETED_ITEM // 200
            } else {
                return message.ERROR_INTERNAL_SERVER_DB // 500
            }

        }

    } catch (error) {
        message.ERROR_INTERNAL_SERVER // 500
    }

}

//Função para retornar todas as relações de filmes e atores do Banco de Dados
const getListarFilmesAtores = async() => {

    try {
        let filmeAtorJSON = {}
        let dadosFilmeAtor = await filmesAtoresDAO.selectAllFilmesAtores()

        if(dadosFilmeAtor){
            
            if(dadosFilmeAtor.length > 0) {
                
                filmeAtorJSON.filmes_atores = dadosFilmeAtor
                filmeAtorJSON.quantidade = dadosFilmeAtor.length
                filmeAtorJSON.status_code = 200
                return filmeAtorJSON
            
            }else{
                return message.ERROR_NOT_FOUND // 404
            }

        }else{
            return message.ERROR_INTERNAL_SERVER_DB // 500
        }
      
    } catch (error) {
        message.ERROR_INTERNAL_SERVER // 500
    }

}

//Função para buscar relação de filme e ator pelo id
const getBuscarFilmeAtor = async(id) => {

    try {
    
        let idFilmeAtor = id
        let filmeAtorJSON = {}

        if(idFilmeAtor == '' || idFilmeAtor == undefined || isNaN(idFilmeAtor)){

            return message.ERROR_INVALID_ID // 400

        } else {

            let dadosFilmeAtor = await filmesAtoresDAO.selectByIdFilmeAtor(idFilmeAtor)

            if(dadosFilmeAtor){

                if(dadosFilmeAtor.length > 0){
                    
                    filmeAtorJSON.filme_ator = dadosFilmeAtor
                    filmeAtorJSON.status_code = 200
                    return filmeAtorJSON

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
    setNovoFilmeAtor,
    setAtualizarFilmeAtor,
    setExcluirFilmeAtor,
    getListarFilmesAtores,
    getBuscarFilmeAtor
}