/****************************************************************************************************************************************************
* Objetivo: Arquivo responsável pela interação entre o APP e a Model, que teremos todas as trativas e regras de negócio para o CRUD da relação de filmes e gêneros
* Data: 09/04/2024
* Autor: Ryan Alves
* Versão: 1.0
****************************************************************************************************************************************************/

const filmesGenerosDAO = require('../model/DAO/filme-genero.js')
const message = require('../modulo/config.js')

const controllerFilmes = require('./controller-filme.js')
const controllerGeneros = require('./controller-genero.js')

//Função para inserir uma nova relação de filme e gênero no Banco de Dados
const setNovoFilmeGenero = async(dadosFilmeGenero, contentType) => {

    try {
     
        if(String(contentType).toLowerCase() == 'application/json'){

            let resultDadosFilmeGenero = {}

            let filme = await controllerFilmes.getBuscarFilme(dadosFilmeGenero.id_filme)
            let genero = await controllerGeneros.getBuscarGenero(dadosFilmeGenero.id_genero)

            if(
                dadosFilmeGenero.id_filme == ''  || dadosFilmeGenero.id_filme == undefined  ||
                dadosFilmeGenero.id_genero == '' || dadosFilmeGenero.id_genero == undefined ||
                filme.status == false            ||
                genero.status == false                 
            ){

                return message.ERROR_REQUIRED_FIELDS // 400  

            }else{

                //Envia os dados para a model inserir no BD
                let novoFilmeGenero = await filmesGenerosDAO.insertFilmeGenero(dadosFilmeGenero)
                
                let id = await filmesGenerosDAO.selectLastId()
                
                dadosFilmeGenero.filme = filme.filme[0].nome
                dadosFilmeGenero.genero = genero.genero[0].nome
                dadosFilmeGenero.id = Number(id[0].id)
                
                //Valida se o BD inseriu corretamente os dados
                if(novoFilmeGenero){

                    resultDadosFilmeGenero.status = message.CREATED_ITEM.status
                    resultDadosFilmeGenero.status_code = message.CREATED_ITEM.status_code
                    resultDadosFilmeGenero.message = message.CREATED_ITEM.message
                    resultDadosFilmeGenero.filme_genero = dadosFilmeGenero
                    return resultDadosFilmeGenero

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

//Função para atualizar uma relação de filme e gênero existente
const setAtualizarFilmeGenero = async(dadosFilmeGenero, contentType, idFilmeGenero) => {

    try {
        
        if(String(contentType).toLowerCase() == 'application/json'){

            let resultDadosFilmeGenero = {}

            let filme = await controllerFilmes.getBuscarFilme(dadosFilmeGenero.id_filme)
            let genero = await controllerGeneros.getBuscarGenero(dadosFilmeGenero.id_genero)
        
            if( 
                idFilmeGenero == ''              || idFilmeGenero == undefined              ||
                dadosFilmeGenero.id_filme == ''  || dadosFilmeGenero.id_filme == undefined  ||
                dadosFilmeGenero.id_genero == '' || dadosFilmeGenero.id_genero == undefined ||
                filme.status == false            ||
                genero.status == false    
            ){
                
                return message.ERROR_REQUIRED_FIELDS // 400
                
            }else{
                
                let filmeGeneroAtualizado = await filmesGenerosDAO.updateFilmeGenero(dadosFilmeGenero, idFilmeGenero)
                                        
                dadosFilmeGenero.filme = filme.filme[0].nome
                dadosFilmeGenero.genero = genero.genero[0].nome
                dadosFilmeGenero.id = idFilmeGenero

                if(filmeGeneroAtualizado){
                    resultDadosFilmeGenero.status = message.UPDATED_ITEM.status
                    resultDadosFilmeGenero.status_code = message.UPDATED_ITEM.status_code
                    resultDadosFilmeGenero.message = message.UPDATED_ITEM.message
                    resultDadosFilmeGenero.filme_genero = dadosFilmeGenero
                    return resultDadosFilmeGenero
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

//Função para excluir uma relação de filme e gênero existente
const setExcluirFilmeGenero = async(id) => {

    try {
        
        let idFilmeGenero = id
        let validacaoFilmeGenero = await getBuscarFilmeGenero(idFilmeGenero)

        if(idFilmeGenero == '' || idFilmeGenero == undefined || isNaN(idFilmeGenero)){
            
            return message.ERROR_INVALID_ID // 400
            
        } else if (validacaoFilmeGenero.status == false) {
            
            return message.ERROR_NOT_FOUND // 404
            
        } else {
            
            let dadosFilmeGenero = await filmesGenerosDAO.deleteFilmeGenero(idFilmeGenero)
            
            if(dadosFilmeGenero){                
                return message.DELETED_ITEM // 200
            } else {
                return message.ERROR_INTERNAL_SERVER_DB // 500
            }

        }

    } catch (error) {
        message.ERROR_INTERNAL_SERVER // 500
    }

}

//Função para retornar todas as relações de filmes e gêneros do Banco de Dados
const getListarFilmesGeneros = async() => {

    try {
        let filmeGeneroJSON = {}
        let dadosFilmeGenero = await filmesGenerosDAO.selectAllFilmesGeneros()

        if(dadosFilmeGenero){
            
            if(dadosFilmeGenero.length > 0) {
                
                filmeGeneroJSON.filmes_generos = dadosFilmeGenero
                filmeGeneroJSON.quantidade = dadosFilmeGenero.length
                filmeGeneroJSON.status_code = 200
                return filmeGeneroJSON
            
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

//Função para buscar relação de filme e gênero pelo id
const getBuscarFilmeGenero = async(id) => {

    try {
    
        let idFilmeGenero = id
        let filmeGeneroJSON = {}

        if(idFilmeGenero == '' || idFilmeGenero == undefined || isNaN(idFilmeGenero)){

            return message.ERROR_INVALID_ID // 400

        } else {

            let dadosFilmeGenero = await filmesGenerosDAO.selectByIdFilmeGenero(idFilmeGenero)

            if(dadosFilmeGenero){

                if(dadosFilmeGenero.length > 0){
                    
                    filmeGeneroJSON.filme_genero = dadosFilmeGenero
                    filmeGeneroJSON.status_code = 200
                    return filmeGeneroJSON

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
    setNovoFilmeGenero,
    setAtualizarFilmeGenero,
    setExcluirFilmeGenero,
    getListarFilmesGeneros,
    getBuscarFilmeGenero
}