/****************************************************************************************************************************************************
* Objetivo: Arquivo responsável pela interação entre o APP e a Model, que teremos todas as trativas e regras de negócio para o CRUD de atores
* Data: 09/04/2024
* Autor: Ryan Alves
* Versão: 1.0
****************************************************************************************************************************************************/

const atoresDAO = require('../model/DAO/ator.js')
const nacionalidadesAtoresDAO = require('../model/DAO/nacionalidade-ator.js')
const message = require('../modulo/config.js')

//Função para inserir um novo ator no Banco de Dados
const setNovoAtor = async(dadosAtor, contentType) => {

    try {

        if(String(contentType).toLowerCase() == 'application/json'){
            
            let resultDadosAtor = {}
            
            if( 
                dadosAtor.nome == ''            || dadosAtor.nome == undefined            || dadosAtor.nome.length > 150            ||
                dadosAtor.foto == ''            || dadosAtor.foto == undefined            || dadosAtor.foto.length > 65535          ||
                dadosAtor.biografia == ''       || dadosAtor.biografia == undefined       || dadosAtor.biografia.length > 65535     ||
                dadosAtor.data_nascimento == '' || dadosAtor.data_nascimento == undefined || dadosAtor.data_nascimento.length != 10 
            ){
                
                return message.ERROR_REQUIRED_FIELDS // 400  
                
            }else{
                
                // Validação de digitação para data de falecimento que não é um campo obrigatório
                if( dadosAtor.data_falecimento != null &&
                    dadosAtor.data_falecimento != ''   &&
                    dadosAtor.data_falecimento != undefined &&
                    dadosAtor.data_falecimento.length != 10
                ){    
                    
                    return message.ERROR_REQUIRED_FIELDS // 400
                    
                }
                
                //Envia os dados para a model inserir no BD
                let novoAtor = await atoresDAO.insertAtor(dadosAtor)
                
                let id = await atoresDAO.selectLastId()
        
                dadosAtor.id = Number(id[0].id)
                
                //Valida se o BD inseriu corretamente os dados
                if(novoAtor){

                    resultDadosAtor.status = message.CREATED_ITEM.status
                    resultDadosAtor.status_code = message.CREATED_ITEM.status_code
                    resultDadosAtor.message = message.CREATED_ITEM.message
                    resultDadosAtor.ator = dadosAtor
                    return resultDadosAtor

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

//Função para atualizar um ator existente
const setAtualizarAtor = async(dadosAtor, contentType, idAtor) => {

    try {
        
        if(String(contentType).toLowerCase() == 'application/json'){

            let resultDadosAtor = {}
        
            if( 
                idAtor == ''                    || idAtor == undefined                    ||
                dadosAtor.nome == ''            || dadosAtor.nome == undefined            || dadosAtor.nome.length > 150            ||
                dadosAtor.foto == ''            || dadosAtor.foto == undefined            || dadosAtor.foto.length > 65535          ||
                dadosAtor.biografia == ''       || dadosAtor.biografia == undefined       || dadosAtor.biografia.length > 65535     ||
                dadosAtor.data_nascimento == '' || dadosAtor.data_nascimento == undefined || dadosAtor.data_nascimento.length != 10 
            ){
                
                return message.ERROR_REQUIRED_FIELDS // 400
                
            }else{

                // Validação de digitação para data de falecimento que não é um campo obrigatório
                if( 
                    dadosAtor.data_falecimento != null &&
                    dadosAtor.data_falecimento != ''   &&
                    dadosAtor.data_falecimento != undefined &&
                    dadosAtor.data_falecimento.length != 10
                ){    
    
                    return message.ERROR_REQUIRED_FIELDS // 400
    
                }
                
                let atorAtualizado = await atoresDAO.updateAtor(dadosAtor, idAtor)
                                        
                dadosAtor.id = idAtor

                if(atorAtualizado){
                    resultDadosAtor.status = message.UPDATED_ITEM.status
                    resultDadosAtor.status_code = message.UPDATED_ITEM.status_code
                    resultDadosAtor.message = message.UPDATED_ITEM.message
                    resultDadosAtor.ator = dadosAtor
                    return resultDadosAtor
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

//Função para excluir um ator existente
const setExcluirAtor = async(id) => {

    try {
        
        let idAtor = id
        let validacaoAtor = await getBuscarAtor(idAtor)

        if(idAtor == '' || idAtor == undefined || isNaN(idAtor)){
            
            return message.ERROR_INVALID_ID // 400
            
        } else if (validacaoAtor.status == false) {
            
            return message.ERROR_NOT_FOUND // 404
            
        } else {
            
            let dadosAtor = await atoresDAO.deleteAtor(idAtor)
            
            if(dadosAtor){                
                return message.DELETED_ITEM // 200
            } else {
                return message.ERROR_INTERNAL_SERVER_DB // 500
            }

        }

    } catch (error) {
        message.ERROR_INTERNAL_SERVER // 500
    }

}

//Função para retornar todos os atores do Banco de Dados
const getListarAtores = async() => {

    try {

        let atorJSON = {}
        let dadosAtor = await atoresDAO.selectAllAtores()
        
        // dadosAtor.forEach(async ator => {
        //     let nacionalidades = await getListarNacionalidadesAtor(ator.id)
        //     if(nacionalidades.status_code == 200){
        //         ator.nacionalidades = nacionalidades.nacionalidades     
        //     }            
        // })

        const promisses = dadosAtor.map(async (ator) => {
            let nacionalidades = await getListarNacionalidadesAtor(ator.id)
            if(nacionalidades.status_code == 200){
                ator.nacionalidades = nacionalidades.nacionalidades     
            } 
        })
        
        await Promise.all(promisses)

        if(dadosAtor){
            
            if(dadosAtor.length > 0) {
                
                atorJSON.atores = dadosAtor
                atorJSON.quantidade = dadosAtor.length
                atorJSON.status_code = 200
                return atorJSON
            
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

//Função para buscar ator pelo id
const getBuscarAtor = async(id) => {

    try {
    
        let idAtor = id
        let atorJSON = {}

        if(idAtor == '' || idAtor == undefined || isNaN(idAtor)){

            return message.ERROR_INVALID_ID // 400

        } else {

            let dadosAtor = await atoresDAO.selectByIdAtor(idAtor)
            let nacionalidades = await getListarNacionalidadesAtor(idAtor)

            if(nacionalidades.status_code == 200){
                dadosAtor[0].nacionalidades = nacionalidades.nacionalidades
            }

            if(dadosAtor){

                if(dadosAtor.length > 0){
                    
                    atorJSON.ator = dadosAtor
                    atorJSON.status_code = 200
                    return atorJSON

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

//Função para buscar nacionalidades de um ator pelo id
const getListarNacionalidadesAtor = async(id) => {
   
    try {
        
        let idAtor = id
        let nacionalidadeJSON = {}

        if(idAtor == '' || idAtor == undefined || isNaN(idAtor)){

            return message.ERROR_INVALID_ID // 400

        } else {

            let dadosNacionalidades = await nacionalidadesAtoresDAO.selectByIdNacionalidades(idAtor)

            if(dadosNacionalidades){

                if(dadosNacionalidades.length > 0){
                    
                    nacionalidadeJSON.nacionalidades = dadosNacionalidades
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
    setNovoAtor,
    setAtualizarAtor,
    setExcluirAtor,
    getListarAtores,
    getBuscarAtor
}