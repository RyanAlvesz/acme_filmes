/****************************************************************************************************************************************************
* Objetivo: Arquivo responsável pela interação entre o APP e a Model, que teremos todas as trativas e regras de negócio para o CRUD da relação de nacionalidades e atores
* Data: 09/04/2024
* Autor: Ryan Alves
* Versão: 1.0
****************************************************************************************************************************************************/

const nacionalidadesAtoresDAO = require('../model/DAO/nacionalidade-ator.js')
const message = require('../modulo/config.js')

const controllerNacionalidades = require('./controller-nacionalidade.js')
const controllerAtores = require('./controller-ator.js')

//Função para inserir uma nova relação de nacionalidade e ator no Banco de Dados
const setNovaNacionalidadeAtor = async(dadosNacionalidadeAtor, contentType) => {

    try {
     
        if(String(contentType).toLowerCase() == 'application/json'){

            let resultDadosNacionalidadeAtor = {}

            let nacionalidade = await controllerNacionalidades.getBuscarNacionalidade(dadosNacionalidadeAtor.id_nacionalidade)
            let ator = await controllerAtores.getBuscarAtores(dadosNacionalidadeAtor.id_ator)

            if(
                dadosNacionalidadeAtor.id_nacionalidade == '' || dadosNacionalidadeAtor.id_nacionalidade == undefined ||
                dadosNacionalidadeAtor.id_ator == ''          || dadosNacionalidadeAtor.id_ator == undefined          ||
                nacionalidade.status == false                 ||
                ator.status == false                 
            ){

                return message.ERROR_REQUIRED_FIELDS // 400  

            }else{

                //Envia os dados para a model inserir no BD
                let novaNacionalidadeAtor = await nacionalidadesAtoresDAO.insertNacionalidadeAtor(dadosNacionalidadeAtor)
                
                let id = await nacionalidadesAtoresDAO.selectLastId()
                
                dadosNacionalidadeAtor.gentilico = nacionalidade.nacionalidade[0].gentilico
                dadosNacionalidadeAtor.ator = ator.ator[0].nome
                dadosNacionalidadeAtor.id = Number(id[0].id)
                
                //Valida se o BD inseriu corretamente os dados
                if(novaNacionalidadeAtor){

                    resultDadosNacionalidadeAtor.status = message.CREATED_ITEM.status
                    resultDadosNacionalidadeAtor.status_code = message.CREATED_ITEM.status_code
                    resultDadosNacionalidadeAtor.message = message.CREATED_ITEM.message
                    resultDadosNacionalidadeAtor.nacionalidade_ator = dadosNacionalidadeAtor
                    return resultDadosNacionalidadeAtor

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

//Função para atualizar uma relação de nacionalidade e ator existente
const setAtualizarNacionalidadeAtor = async(dadosNacionalidadeAtor, contentType, idNacionalidadeAtor) => {

    try {
        
        if(String(contentType).toLowerCase() == 'application/json'){

            let resultDadosNacionalidadeAtor = {}

            let nacionalidade = await controllerNacionalidades.getBuscarNacionalidade(dadosNacionalidadeAtor.id_nacionalidade)
            let ator = await controllerAtores.getBuscarAtores(dadosNacionalidadeAtor.id_ator)
        
            if( 
                idNacionalidadeAtor == ''             || idNacionalidadeAtor == undefined             ||
                dadosNacionalidadeAtor.id_nacionalidade == '' || dadosNacionalidadeAtor.id_nacionalidade == undefined ||
                dadosNacionalidadeAtor.id_ator == ''          || dadosNacionalidadeAtor.id_ator == undefined          ||
                nacionalidade.status == false                 ||
                ator.status == false   
            ){
                
                return message.ERROR_REQUIRED_FIELDS // 400
                
            }else{
                
                let nacionalidadeAtualizada = await nacionalidadesAtoresDAO.updateNacionalidadeAtor(dadosNacionalidadeAtor, idNacionalidadeAtor)
                                        
                dadosNacionalidadeAtor.gentilico = nacionalidade.nacionalidade[0].gentilico
                dadosNacionalidadeAtor.ator = ator.ator[0].nome
                dadosNacionalidadeAtor.id = idNacionalidadeAtor

                if(nacionalidadeAtualizada){
                    resultDadosNacionalidadeAtor.status = message.UPDATED_ITEM.status
                    resultDadosNacionalidadeAtor.status_code = message.UPDATED_ITEM.status_code
                    resultDadosNacionalidadeAtor.message = message.UPDATED_ITEM.message
                    resultDadosNacionalidadeAtor.nacionalidade_ator = dadosNacionalidadeAtor
                    return resultDadosNacionalidadeAtor
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

//Função para excluir uma relação de nacionalidade e ator existente
const setExcluirNacionalidadeAtor = async(id) => {

    try {
        
        let idNacionalidadeAtor = id
        let validacaoNacionalidadeAtor = await getBuscarNacionalidadeAtor(idNacionalidadeAtor)

        if(idNacionalidadeAtor == '' || idNacionalidadeAtor == undefined || isNaN(idNacionalidadeAtor)){
            
            return message.ERROR_INVALID_ID // 400
            
        } else if (validacaoNacionalidadeAtor.status == false) {
            
            return message.ERROR_NOT_FOUND // 404
            
        } else {
            
            let dadosNacionalidadeAtor = await nacionalidadesAtoresDAO.deleteNacionalidadeAtor(idNacionalidadeAtor)
            
            if(dadosNacionalidadeAtor){                
                return message.DELETED_ITEM // 200
            } else {
                return message.ERROR_INTERNAL_SERVER_DB // 500
            }

        }

    } catch (error) {
        message.ERROR_INTERNAL_SERVER // 500
    }

}

//Função para retornar todas as relações de nacionalidades e atores do Banco de Dados
const getListarNacionalidadesAtores = async() => {

    try {
        let nacionalidadeAtorJSON = {}
        let dadosNacionalidadeAtor = await nacionalidadesAtoresDAO.selectAllNacionalidadesAtores()

        if(dadosNacionalidadeAtor){
            
            if(dadosNacionalidadeAtor.length > 0) {
                
                nacionalidadeAtorJSON.nacionalidades_atores = dadosNacionalidadeAtor
                nacionalidadeAtorJSON.quantidade = dadosNacionalidadeAtor.length
                nacionalidadeAtorJSON.status_code = 200
                return nacionalidadeAtorJSON
            
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

//Função para buscar relação de nacionalidade e ator pelo id
const getBuscarNacionalidadeAtor = async(id) => {

    try {
    
        let idNacionalidadeAtor = id
        let nacionalidadeAtorJSON = {}

        if(idNacionalidadeAtor == '' || idNacionalidadeAtor == undefined || isNaN(idNacionalidadeAtor)){

            return message.ERROR_INVALID_ID // 400

        } else {

            let dadosNacionalidadeAtor = await nacionalidadesAtoresDAO.selectByIdNacionalidadeAtor(idNacionalidadeAtor)

            if(dadosNacionalidadeAtor){

                if(dadosNacionalidadeAtor.length > 0){
                    
                    nacionalidadeAtorJSON.nacionalidade_ator = dadosNacionalidadeAtor
                    nacionalidadeAtorJSON.status_code = 200
                    return nacionalidadeAtorJSON

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
    setNovaNacionalidadeAtor,
    setAtualizarNacionalidadeAtor,
    setExcluirNacionalidadeAtor,
    getListarNacionalidadesAtores,
    getBuscarNacionalidadeAtor
}