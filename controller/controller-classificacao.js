/****************************************************************************************************************************************************
* Objetivo: Arquivo responsável pela interação entre o APP e a Model, que teremos todas as trativas e regras de negócio para o CRUD de classificações
* Data: 09/04/2024
* Autor: Ryan Alves
* Versão: 1.0
****************************************************************************************************************************************************/

const classificacoesDAO = require('../model/DAO/classificacao.js')
const message = require('../modulo/config.js')

//Função para inserir uma nova classificacao no Banco de Dados
const setNovaClassificacao = async(dadosClassificacao, contentType) => {

    try {
     
        if(String(contentType).toLowerCase() == 'application/json'){

            let resultDadosClassificacao = {}
        
            if(
                dadosClassificacao.sigla == ''                        || dadosClassificacao.sigla == undefined                        || dadosClassificacao.sigla.length > 5                            ||
                dadosClassificacao.descricao == ''                    || dadosClassificacao.descricao == undefined                    || dadosClassificacao.descricao.length > 150                      ||
                dadosClassificacao.classificacao_indicativa == ''     || dadosClassificacao.classificacao_indicativa == undefined     || dadosClassificacao.classificacao_indicativa.length > 150       ||
                dadosClassificacao.icone == ''                        || dadosClassificacao.icone == undefined                        || dadosClassificacao.icone.length > 65535
            ){

                return message.ERROR_REQUIRED_FIELDS // 400  

            }else{

                //Envia os dados para a model inserir no BD
                let novaClassificacao = await classificacoesDAO.insertClassificacao(dadosClassificacao)
                
                let id = await classificacoesDAO.selectLastId()
        
                dadosClassificacao.id = Number(id[0].id)
                
                //Valida se o BD inseriu corretamente os dados
                if(novaClassificacao){

                    resultDadosClassificacao.status = message.CREATED_ITEM.status
                    resultDadosClassificacao.status_code = message.CREATED_ITEM.status_code
                    resultDadosClassificacao.message = message.CREATED_ITEM.message
                    resultDadosClassificacao.classificacao = dadosClassificacao
                    return resultDadosClassificacao

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

//Função para atualizar uma classificacao existente
const setAtualizarClassificacao = async(dadosClassificacao, contentType, idClassificacao) => {

    try {
        
        if(String(contentType).toLowerCase() == 'application/json'){

            let resultDadosClassificacao = {}
        
            if( 
                idClassificacao == ''                                 || idClassificacao == undefined                                 ||
                dadosClassificacao.sigla == ''                        || dadosClassificacao.sigla == undefined                        || dadosClassificacao.sigla.length > 5                            ||
                dadosClassificacao.descricao == ''                    || dadosClassificacao.descricao == undefined                    || dadosClassificacao.descricao.length > 150                      ||
                dadosClassificacao.classificacao_indicativa == ''     || dadosClassificacao.classificacao_indicativa == undefined     || dadosClassificacao.classificacao_indicativa.length > 150       ||
                dadosClassificacao.icone == ''                        || dadosClassificacao.icone == undefined                        || dadosClassificacao.icone.length > 65535
            ){
                
                return message.ERROR_REQUIRED_FIELDS // 400
                
            }else{
                
                let classificacaoAtualizada = await classificacoesDAO.updateClassificacao(dadosClassificacao, idClassificacao)
                                        
                dadosClassificacao.id = idClassificacao

                if(classificacaoAtualizada){
                    resultDadosClassificacao.status = message.UPDATED_ITEM.status
                    resultDadosClassificacao.status_code = message.UPDATED_ITEM.status_code
                    resultDadosClassificacao.message = message.UPDATED_ITEM.message
                    resultDadosClassificacao.classificacao = dadosClassificacao
                    return resultDadosClassificacao
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

//Função para excluir uma classificacao existente
const setExcluirClassificacao = async(id) => {

    try {
        
        let idClassificacao = id
        let validacaoClassificacao = await getBuscarClassificacao(idClassificacao)

        if(idClassificacao == '' || idClassificacao == undefined || isNaN(idClassificacao)){
            
            return message.ERROR_INVALID_ID // 400
            
        } else if (validacaoClassificacao.status == false) {
            
            return message.ERROR_NOT_FOUND // 404
            
        } else {
            
            let dadosClassificacao = await classificacoesDAO.deleteClassificacao(idClassificacao)
            
            if(dadosClassificacao){                
                return message.DELETED_ITEM // 200
            } else {
                return message.ERROR_INTERNAL_SERVER_DB // 500
            }

        }

    } catch (error) {
        message.ERROR_INTERNAL_SERVER // 500
    }

}

//Função para retornar todas as classificações do Banco de Dados
const getListarClassificacoes = async() => {

    try {
        let classificacaoJSON = {}
        let dadosClassificacao = await classificacoesDAO.selectAllClassificacoes()

        if(dadosClassificacao){
            
            if(dadosClassificacao.length > 0) {
                
                classificacaoJSON.classificacoes = dadosClassificacao
                classificacaoJSON.quantidade = dadosClassificacao.length
                classificacaoJSON.status_code = 200
                return classificacaoJSON
            
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

//Função para buscar classificacao pelo id
const getBuscarClassificacao = async(id) => {

    try {
    
        let idClassificacao = id
        let classificacaoJSON = {}

        if(idClassificacao == '' || idClassificacao == undefined || isNaN(idClassificacao)){

            return message.ERROR_INVALID_ID // 400

        } else {

            let dadosClassificacao = await classificacoesDAO.selectByIdClassificacao(idClassificacao)

            if(dadosClassificacao){

                if(dadosClassificacao.length > 0){
                    
                    classificacaoJSON.classificacao = dadosClassificacao
                    classificacaoJSON.status_code = 200
                    return classificacaoJSON

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
    setNovaClassificacao,
    setAtualizarClassificacao,
    setExcluirClassificacao,
    getListarClassificacoes,
    getBuscarClassificacao
}