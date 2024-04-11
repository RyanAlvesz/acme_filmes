/****************************************************************************************************************************************************
* Objetivo: Arquivo responsável pela interação entre o APP e a Model, que teremos todas as trativas e regras de negócio para o CRUD de gêneros
* Data: 09/04/2024
* Autor: Ryan Alves
* Versão: 1.0
****************************************************************************************************************************************************/

const generosDAO = require('../model/DAO/genero.js')
const message = require('../modulo/config.js')

//Função para inserir um novo gênero no Banco de Dados
const setNovoGenero = async(dadosGenero, contentType) => {

    try {
     
        if(String(contentType).toLowerCase() == 'application/json'){

            let resultDadosGenero = {}
        
            if(dadosGenero.nome == '' || dadosGenero.nome == undefined || dadosGenero.nome.length > 100){

                return message.ERROR_REQUIRED_FIELDS // 400  

            }else{

                //Envia os dados para a model inserir no BD
                let novoGenero = await generosDAO.insertGenero(dadosGenero)
                
                let id = await generosDAO.selectLastId()
        
                dadosGenero.id = Number(id[0].id)
                
                //Valida se o BD inseriu corretamente os dados
                if(novoGenero){

                    resultDadosGenero.status = message.CREATED_ITEM.status
                    resultDadosGenero.status_code = message.CREATED_ITEM.status_code
                    resultDadosGenero.message = message.CREATED_ITEM.message
                    resultDadosGenero.genero = dadosGenero
                    return resultDadosGenero

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

//Função para atualizar um gênero existente
const setAtualizarGenero = async(dadosGenero, contentType, idGenero) => {

    try {
        
        if(String(contentType).toLowerCase() == 'application/json'){

            let resultDadosGenero = {}
        
            if( 
                idGenero == ''         || idGenero == undefined          ||
                dadosGenero.nome == '' || dadosGenero.nome == undefined  || dadosGenero.nome.length > 100
            ){
                
                return message.ERROR_REQUIRED_FIELDS // 400
                
            }else{
                
                let generoAtualizado = await generosDAO.updateGenero(dadosGenero, idGenero)
                                        
                dadosGenero.id = idGenero

                if(generoAtualizado){
                    resultDadosGenero.status = message.UPDATED_ITEM.status
                    resultDadosGenero.status_code = message.UPDATED_ITEM.status_code
                    resultDadosGenero.message = message.UPDATED_ITEM.message
                    resultDadosGenero.genero = dadosGenero
                    return resultDadosGenero
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

//Função para excluir um gênero existente
const setExcluirGenero = async(id) => {

    try {
        
        let idGenero = id
        let validacaoGenero = await getBuscarGenero(idGenero)

        if(idGenero == '' || idGenero == undefined || isNaN(idGenero)){
            
            return message.ERROR_INVALID_ID // 400
            
        } else if (validacaoGenero.status == false) {
            
            return message.ERROR_NOT_FOUND // 404
            
        } else {
            
            let dadosGenero = await generosDAO.deleteGenero(idGenero)
            
            if(dadosGenero){                
                return message.DELETED_ITEM // 200
            } else {
                return message.ERROR_INTERNAL_SERVER_DB // 500
            }

        }

    } catch (error) {
        message.ERROR_INTERNAL_SERVER // 500
    }

}

//Função para retornar todos os gêneros do Banco de Dados
const getListarGeneros = async() => {

    try {
        let generoJSON = {}
        let dadosGenero = await generosDAO.selectAllGeneros()

        if(dadosGenero){
            
            if(dadosGenero.length > 0) {
                
                generoJSON.generos = dadosGenero
                generoJSON.quantidade = dadosGenero.length
                generoJSON.status_code = 200
                return generoJSON
            
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

//Função para buscar gênero pelo id
const getBuscarGenero = async(id) => {

    try {
    
        let idGenero = id
        let generoJSON = {}

        if(idGenero == '' || idGenero == undefined || isNaN(idGenero)){

            return message.ERROR_INVALID_ID // 400

        } else {

            let dadosGenero = await generosDAO.selectByIdGenero(idGenero)

            if(dadosGenero){

                if(dadosGenero.length > 0){
                    
                    generoJSON.genero = dadosGenero
                    generoJSON.status_code = 200
                    return generoJSON

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
    setNovoGenero,
    setAtualizarGenero,
    setExcluirGenero,
    getListarGeneros,
    getBuscarGenero
}