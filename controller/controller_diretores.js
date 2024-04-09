/****************************************************************************************************************************************************
* Objetivo: Arquivo responsável pela interação entre o APP e a Model, que teremos todas as trativas e regras de negócio para o CRUD de diretores
* Data: 30/01/2024
* Autor: Ryan Alves
* Versão: 1.0
****************************************************************************************************************************************************/

// Import do arquivo DAO para manipular dados dos BD
const diretoresDAO = require('../model/DAO/diretores.js')

// Import do arquivo para mensagens
const message = require('../modulo/config.js')

//Função para inserir um novo diretor no Banco de Dados
const setNovoDiretor = async(dadosDiretor, contentType) => {

    try {
     
        if(String(contentType).toLowerCase() == 'application/json'){

            let resultDadosDiretor = {}
        
            if( dadosDiretor.nome == ''                     || dadosDiretor.nome == undefined              || dadosDiretor.nome.length > 100){

                return message.ERROR_REQUIRED_FIELDS // 400  

            }else{

                //Envia os dados para a model inserir no BD
                let novoDiretor = await diretoresDAO.insertDiretor(dadosDiretor)
                
                let id = await diretoresDAO.selectLastId()
        
                dadosDiretor.id = Number(id[0].id)
                
                //Valida se o BD inseriu corretamente os dados
                if(novoDiretor){

                    resultDadosDiretor.status = message.CREATED_ITEM.status
                    resultDadosDiretor.status_code = message.CREATED_ITEM.status_code
                    resultDadosDiretor.message = message.CREATED_ITEM.message
                    resultDadosDiretor.diretor = dadosDiretor
                    return resultDadosDiretor

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

//Função para atualizar um diretor existente
const setAtualizarDiretor = async(dadosDiretor, contentType, idDiretor) => {

    try {
        
        if(String(contentType).toLowerCase() == 'application/json'){

            let resultDadosDiretor = {}
        
            if( 
                idDiretor == ''                             || idDiretor == undefined                      ||
                dadosDiretor.nome == ''                     || dadosDiretor.nome == undefined              || dadosDiretor.nome.length > 80
            ){
                
                return message.ERROR_REQUIRED_FIELDS // 400
                
            }else{
                
                let diretorAtualizado = await diretoresDAO.updateDiretor(dadosDiretor, idDiretor)
                                        
                dadosDiretor.id = idDiretor

                if(diretorAtualizado){
                    resultDadosDiretor.status = message.UPDATED_ITEM.status
                    resultDadosDiretor.status_code = message.UPDATED_ITEM.status_code
                    resultDadosDiretor.message = message.UPDATED_ITEM.message
                    resultDadosDiretor.diretor = dadosDiretor
                    return resultDadosDiretor
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

//Função para excluir um diretor existente
const setExcluirDiretor = async(id) => {

    try {
        
        let idDiretor = id
        let validacaoDiretor = await getBuscarDiretor(idDiretor)

        if(idDiretor == '' || idDiretor == undefined || isNaN(idDiretor)){
            
            return message.ERROR_INVALID_ID // 400
            
        } else if (validacaoDiretor.status == false) {
            
            return message.ERROR_NOT_FOUND // 404
            
        } else {
            
            let dadosDiretor = await diretoresDAO.deleteDiretor(idDiretor)
            
            if(dadosDiretor){                
                return message.DELETED_ITEM // 200
            } else {
                return message.ERROR_INTERNAL_SERVER_DB // 500
            }

        }

    } catch (error) {
        message.ERROR_INTERNAL_SERVER // 500
    }

}

//Função para retornar todos os diretores do Banco de Dados
const getListarDiretores = async() => {

    try {
        let diretorJSON = {}
        let dadosDiretor = await diretoresDAO.selectAllDiretores()

        if(dadosDiretor){
            
            if(dadosDiretor.length > 0) {
                
                diretorJSON.diretores = dadosDiretor
                diretorJSON.quantidade = dadosDiretor.length
                diretorJSON.status_code = 200
                return diretorJSON
            
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

//Função para buscar diretor pelo id
const getBuscarDiretor = async(id) => {

    try {
    
        let idDiretor = id
        let diretorJSON = {}

        if(idDiretor == '' || idDiretor == undefined || isNaN(idDiretor)){

            return message.ERROR_INVALID_ID // 400

        } else {

            let dadosDiretor = await diretoresDAO.selectByIdDiretor(idDiretor)

            if(dadosDiretor){

                if(dadosDiretor.length > 0){
                    
                    diretorJSON.diretor = dadosDiretor
                    diretorJSON.status_code = 200
                    return diretorJSON

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
    setNovoDiretor,
    setAtualizarDiretor,
    setExcluirDiretor,
    getListarDiretores,
    getBuscarDiretor
}