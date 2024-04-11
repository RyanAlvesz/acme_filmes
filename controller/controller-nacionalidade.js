/****************************************************************************************************************************************************
* Objetivo: Arquivo responsável pela interação entre o APP e a Model, que teremos todas as trativas e regras de negócio para o CRUD de nacionalidades
* Data: 09/04/2024
* Autor: Ryan Alves
* Versão: 1.0
****************************************************************************************************************************************************/

const nacionalidadesDAO = require('../model/DAO/nacionalidade.js')
const message = require('../modulo/config.js')

//Função para inserir uma nova nacionalidade no Banco de Dados
const setNovaNacionalidade = async(dadosNacionalidade, contentType) => {

    try {
     
        if(String(contentType).toLowerCase() == 'application/json'){

            let resultDadosNacionalidade = {}
        
            if(
                dadosNacionalidade.pais == ''     || dadosNacionalidade.pais == undefined     || dadosNacionalidade.pais.length > 150       ||
                dadosNacionalidade.nome == ''     || dadosNacionalidade.nome == undefined     || dadosNacionalidade.nome.length > 150       ||
                dadosNacionalidade.bandeira == '' || dadosNacionalidade.bandeira == undefined || dadosNacionalidade.bandeira.length > 65535
            ){

                return message.ERROR_REQUIRED_FIELDS // 400  

            }else{

                //Envia os dados para a model inserir no BD
                let novaNacionalidade = await nacionalidadesDAO.insertNacionalidade(dadosNacionalidade)
                
                let id = await nacionalidadesDAO.selectLastId()
        
                dadosNacionalidade.id = Number(id[0].id)
                
                //Valida se o BD inseriu corretamente os dados
                if(novaNacionalidade){

                    resultDadosNacionalidade.status = message.CREATED_ITEM.status
                    resultDadosNacionalidade.status_code = message.CREATED_ITEM.status_code
                    resultDadosNacionalidade.message = message.CREATED_ITEM.message
                    resultDadosNacionalidade.nacionalidade = dadosNacionalidade
                    return resultDadosNacionalidade

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

//Função para atualizar uma nacionalidade existente
const setAtualizarNacionalidade = async(dadosNacionalidade, contentType, idNacionalidade) => {

    try {
        
        if(String(contentType).toLowerCase() == 'application/json'){

            let resultDadosNacionalidade = {}
        
            if( 
                idNacionalidade == ''             || idNacionalidade == undefined             ||
                dadosNacionalidade.pais == ''     || dadosNacionalidade.pais == undefined     || dadosNacionalidade.pais.length > 150       ||
                dadosNacionalidade.nome == ''     || dadosNacionalidade.nome == undefined     || dadosNacionalidade.nome.length > 150       ||
                dadosNacionalidade.bandeira == '' || dadosNacionalidade.bandeira == undefined || dadosNacionalidade.bandeira.length > 65535
            ){
                
                return message.ERROR_REQUIRED_FIELDS // 400
                
            }else{
                
                let nacionalidadeAtualizada = await nacionalidadesDAO.updateNacionalidade(dadosNacionalidade, idNacionalidade)
                                        
                dadosNacionalidade.id = idNacionalidade

                if(nacionalidadeAtualizada){
                    resultDadosNacionalidade.status = message.UPDATED_ITEM.status
                    resultDadosNacionalidade.status_code = message.UPDATED_ITEM.status_code
                    resultDadosNacionalidade.message = message.UPDATED_ITEM.message
                    resultDadosNacionalidade.nacionalidade = dadosNacionalidade
                    return resultDadosNacionalidade
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

//Função para excluir uma nacionalidade existente
const setExcluirNacionalidade = async(id) => {

    try {
        
        let idNacionalidade = id
        let validacaoNacionalidade = await getBuscarNacionalidade(idNacionalidade)

        if(idNacionalidade == '' || idNacionalidade == undefined || isNaN(idNacionalidade)){
            
            return message.ERROR_INVALID_ID // 400
            
        } else if (validacaoNacionalidade.status == false) {
            
            return message.ERROR_NOT_FOUND // 404
            
        } else {
            
            let dadosNacionalidade = await nacionalidadesDAO.deleteNacionalidade(idNacionalidade)
            
            if(dadosNacionalidade){                
                return message.DELETED_ITEM // 200
            } else {
                return message.ERROR_INTERNAL_SERVER_DB // 500
            }

        }

    } catch (error) {
        message.ERROR_INTERNAL_SERVER // 500
    }

}

//Função para retornar todas as nacionalidades do Banco de Dados
const getListarNacionalidades = async() => {

    try {
        let nacionalidadeJSON = {}
        let dadosNacionalidade = await nacionalidadesDAO.selectAllNacionalidade()

        if(dadosNacionalidade){
            
            if(dadosNacionalidade.length > 0) {
                
                nacionalidadeJSON.nacionalidades = dadosNacionalidade
                nacionalidadeJSON.quantidade = dadosNacionalidade.length
                nacionalidadeJSON.status_code = 200
                return nacionalidadeJSON
            
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

//Função para buscar nacionalidade pelo id
const getBuscarNacionalidade = async(id) => {

    try {
    
        let idNacionalidade = id
        let nacionalidadeJSON = {}

        if(idNacionalidade == '' || idNacionalidade == undefined || isNaN(idNacionalidade)){

            return message.ERROR_INVALID_ID // 400

        } else {

            let dadosNacionalidade = await nacionalidadesDAO.selectByIdNacionalidade(idNacionalidade)

            if(dadosNacionalidade){

                if(dadosNacionalidade.length > 0){
                    
                    nacionalidadeJSON.nacionalidade = dadosNacionalidade
                    nacionalidadeJSON.status_code = 200
                    return nacionalidadeJSON

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
    setNovaNacionalidade,
    setAtualizarNacionalidade,
    setExcluirNacionalidade,
    getListarNacionalidades,
    getBuscarNacionalidade
}