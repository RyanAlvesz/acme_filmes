/****************************************************************************************************************************************************
* Objetivo: Arquivo responsável pela interação entre o APP e a Model, que teremos todas as trativas e regras de negócio para o CRUD da relação de filmes e diretores
* Data: 09/04/2024
* Autor: Ryan Alves
* Versão: 1.0
****************************************************************************************************************************************************/

const filmesDiretoresDAO = require('../model/DAO/filme-diretor.js')
const message = require('../modulo/config.js')

const controllerFilmes = require('./controller-filme.js')
const controllerDiretores = require('./controller-diretor.js')

//Função para inserir uma nova relação de filme e diretor no Banco de Dados
const setNovoFilmeDiretor = async(dadosFilmeDiretor, contentType) => {

    try {
     
        if(String(contentType).toLowerCase() == 'application/json'){

            let resultDadosFilmeDiretor = {}

            let filme = await controllerFilmes.getBuscarFilme(dadosFilmeDiretor.id_filme)
            let diretor = await controllerDiretores.getBuscarDiretor(dadosFilmeDiretor.id_diretor)

            if(
                dadosFilmeDiretor.id_filme == ''   || dadosFilmeDiretor.id_filme == undefined   ||
                dadosFilmeDiretor.id_diretor == '' || dadosFilmeDiretor.id_diretor == undefined ||
                filme.status == false              ||
                diretor.status == false                 
            ){

                return message.ERROR_REQUIRED_FIELDS // 400  

            }else{

                //Envia os dados para a model inserir no BD
                let novoFilmeDiretor = await filmesDiretoresDAO.insertFilmeDiretor(dadosFilmeDiretor)
                
                let id = await filmesDiretoresDAO.selectLastId()
                
                dadosFilmeDiretor.filme = filme.filme[0].nome
                dadosFilmeDiretor.diretor = diretor.diretor[0].nome
                dadosFilmeDiretor.id = Number(id[0].id)
                
                //Valida se o BD inseriu corretamente os dados
                if(novoFilmeDiretor){

                    resultDadosFilmeDiretor.status = message.CREATED_ITEM.status
                    resultDadosFilmeDiretor.status_code = message.CREATED_ITEM.status_code
                    resultDadosFilmeDiretor.message = message.CREATED_ITEM.message
                    resultDadosFilmeDiretor.filme_diretor = dadosFilmeDiretor
                    return resultDadosFilmeDiretor

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

//Função para atualizar uma relação de filme e diretor existente
const setAtualizarFilmeDiretor = async(dadosFilmeDiretor, contentType, idFilmeDiretor) => {

    try {
        
        if(String(contentType).toLowerCase() == 'application/json'){

            let resultDadosFilmeDiretor = {}

            let filme = await controllerFilmes.getBuscarFilme(dadosFilmeDiretor.id_filme)
            let diretor = await controllerDiretores.getBuscarDiretor(dadosFilmeDiretor.id_diretor)
        
            if( 
                idFilmeDiretor == ''               || idFilmeDiretor == undefined               ||
                dadosFilmeDiretor.id_filme == ''   || dadosFilmeDiretor.id_filme == undefined   ||
                dadosFilmeDiretor.id_diretor == '' || dadosFilmeDiretor.id_diretor == undefined ||
                filme.status == false              ||
                diretor.status == false        
            ){
                
                return message.ERROR_REQUIRED_FIELDS // 400
                
            }else{
                
                let filmeDiretorAtualizado = await filmesDiretoresDAO.updateFilmeDiretor(dadosFilmeDiretor, idFilmeDiretor)
                                        
                dadosFilmeDiretor.filme = filme.filme[0].nome
                dadosFilmeDiretor.diretor = diretor.diretor[0].nome
                dadosFilmeDiretor.id = idFilmeDiretor

                if(filmeDiretorAtualizado){
                    resultDadosFilmeDiretor.status = message.UPDATED_ITEM.status
                    resultDadosFilmeDiretor.status_code = message.UPDATED_ITEM.status_code
                    resultDadosFilmeDiretor.message = message.UPDATED_ITEM.message
                    resultDadosFilmeDiretor.filme_diretor = dadosFilmeDiretor
                    return resultDadosFilmeDiretor
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

//Função para excluir uma relação de filme e diretor existente
const setExcluirFilmeDiretor = async(id) => {

    try {
        
        let idFilmeDiretor = id
        let validacaoFilmeDiretor = await getBuscarFilmeDiretor(idFilmeDiretor)

        if(idFilmeDiretor == '' || idFilmeDiretor == undefined || isNaN(idFilmeDiretor)){
            
            return message.ERROR_INVALID_ID // 400
            
        } else if (validacaoFilmeDiretor.status == false) {
            
            return message.ERROR_NOT_FOUND // 404
            
        } else {
            
            let dadosFilmeDiretor = await filmesDiretoresDAO.deleteFilmeDiretor(idFilmeDiretor)
            
            if(dadosFilmeDiretor){                
                return message.DELETED_ITEM // 200
            } else {
                return message.ERROR_INTERNAL_SERVER_DB // 500
            }

        }

    } catch (error) {
        message.ERROR_INTERNAL_SERVER // 500
    }

}

//Função para retornar todas as relações de filmes e diretores do Banco de Dados
const getListarFilmesDiretores = async() => {

    try {
        let filmeDiretorJSON = {}
        let dadosFilmeDiretor = await filmesDiretoresDAO.selectAllFilmesDiretores()

        if(dadosFilmeDiretor){
            
            if(dadosFilmeDiretor.length > 0) {
                
                filmeDiretorJSON.filmes_diretores = dadosFilmeDiretor
                filmeDiretorJSON.quantidade = dadosFilmeDiretor.length
                filmeDiretorJSON.status_code = 200
                return filmeDiretorJSON
            
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

//Função para buscar relação de filme e diretor pelo id
const getBuscarFilmeDiretor = async(id) => {

    try {
    
        let idFilmeDiretor = id
        let filmeDiretorJSON = {}

        if(idFilmeDiretor == '' || idFilmeDiretor == undefined || isNaN(idFilmeDiretor)){

            return message.ERROR_INVALID_ID // 400

        } else {

            let dadosFilmeDiretor = await filmesDiretoresDAO.selectByIdFilmeDiretor(idFilmeDiretor)

            if(dadosFilmeDiretor){

                if(dadosFilmeDiretor.length > 0){
                    
                    filmeDiretorJSON.filme_diretor = dadosFilmeDiretor
                    filmeDiretorJSON.status_code = 200
                    return filmeDiretorJSON

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
    setNovoFilmeDiretor,
    setAtualizarFilmeDiretor,
    setExcluirFilmeDiretor,
    getListarFilmesDiretores,
    getBuscarFilmeDiretor
}