/****************************************************************************************************************************************************
* Objetivo: Arquivo responsável pela interação entre o APP e a Model, que teremos todas as trativas e regras de negócio para o CRUD de funcionários
* Data: 09/04/2024
* Autor: Ryan Alves
* Versão: 1.0
****************************************************************************************************************************************************/

const funcionariosDAO = require('../model/DAO/funcionario.js')
const message = require('../modulo/config.js')

//Função para inserir um novo funcionário no Banco de Dados
const setNovoFuncionario = async(dadosFuncionario, contentType) => {

    try {
     
        if(String(contentType).toLowerCase() == 'application/json'){

            let resultDadosFuncionario = {}
        
            if( dadosFuncionario.nome == ''  || dadosFuncionario.nome == undefined  || dadosFuncionario.nome.length > 100  ||
                dadosFuncionario.email == '' || dadosFuncionario.email == undefined || dadosFuncionario.email.length > 100 ||
                dadosFuncionario.senha == '' || dadosFuncionario.senha == undefined || dadosFuncionario.senha.length > 50 
            ){

                return message.ERROR_REQUIRED_FIELDS // 400  

            }else{

                //Envia os dados para a model inserir no BD
                let novoFuncionario = await funcionariosDAO.insertFuncionario(dadosFuncionario)
                
                let id = await funcionariosDAO.selectLastId()
        
                dadosFuncionario.id = Number(id[0].id)
                
                //Valida se o BD inseriu corretamente os dados
                if(novoFuncionario){

                    resultDadosFuncionario.status = message.CREATED_ITEM.status
                    resultDadosFuncionario.status_code = message.CREATED_ITEM.status_code
                    resultDadosFuncionario.message = message.CREATED_ITEM.message
                    resultDadosFuncionario.funcionario = dadosFuncionario
                    return resultDadosFuncionario

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

//Função para atualizar um funcionário existente
const setAtualizarFuncionario = async(dadosFuncionario, contentType, idFuncionario) => {

    try {
        
        if(String(contentType).toLowerCase() == 'application/json'){

            let resultDadosFuncionario = {}
        
            if( 
                idFuncionario == ''          || idFuncionario == undefined          ||
                dadosFuncionario.nome == ''  || dadosFuncionario.nome == undefined  || dadosFuncionario.nome.length > 100  ||
                dadosFuncionario.email == '' || dadosFuncionario.email == undefined || dadosFuncionario.email.length > 100 
            ){
                
                return message.ERROR_REQUIRED_FIELDS // 400
                
            }else{
                
                let funcionarioAtualizado = await funcionariosDAO.updateFuncionario(dadosFuncionario, idFuncionario)
                                        
                dadosFuncionario.id = idFuncionario

                if(funcionarioAtualizado){
                    resultDadosFuncionario.status = message.UPDATED_ITEM.status
                    resultDadosFuncionario.status_code = message.UPDATED_ITEM.status_code
                    resultDadosFuncionario.message = message.UPDATED_ITEM.message
                    resultDadosFuncionario.funcionario = dadosFuncionario
                    return resultDadosFuncionario
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

//Função para atualizar um funcionário existente
const setAtualizarFuncionarioSenha = async(dadosFuncionario, contentType, idFuncionario) => {

    try {
        
        if(String(contentType).toLowerCase() == 'application/json'){

            let resultDadosFuncionario = {}
        
            if( 
                idFuncionario == ''          || idFuncionario == undefined          ||
                dadosFuncionario.nome == ''  || dadosFuncionario.nome == undefined  || dadosFuncionario.nome.length > 100  ||
                dadosFuncionario.email == '' || dadosFuncionario.email == undefined || dadosFuncionario.email.length > 100 ||
                dadosFuncionario.senha == '' || dadosFuncionario.senha == undefined || dadosFuncionario.senha.length > 50 
            ){
                
                return message.ERROR_REQUIRED_FIELDS // 400
                
            }else{
                
                let funcionarioAtualizado = await funcionariosDAO.updateFuncionario(dadosFuncionario, idFuncionario)
                                        
                dadosFuncionario.id = idFuncionario

                if(funcionarioAtualizado){
                    resultDadosFuncionario.status = message.UPDATED_ITEM.status
                    resultDadosFuncionario.status_code = message.UPDATED_ITEM.status_code
                    resultDadosFuncionario.message = message.UPDATED_ITEM.message
                    resultDadosFuncionario.funcionario = dadosFuncionario
                    return resultDadosFuncionario
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

//Função para excluir um funcionário existente
const setExcluirFuncionario = async(id) => {

    try {
        
        let idFuncionario = id
        let validacaoFuncionario = await getBuscarFuncionario(idFuncionario)

        if(idFuncionario == '' || idFuncionario == undefined || isNaN(idFuncionario)){
            
            return message.ERROR_INVALID_ID // 400
            
        } else if (validacaoFuncionario.status == false) {
            
            return message.ERROR_NOT_FOUND // 404
            
        } else {
            
            let dadosFuncionario = await funcionariosDAO.deleteFuncionario(idFuncionario)
            
            if(dadosFuncionario){                
                return message.DELETED_ITEM // 200
            } else {
                return message.ERROR_INTERNAL_SERVER_DB // 500
            }

        }

    } catch (error) {
        message.ERROR_INTERNAL_SERVER // 500
    }

}

//Função para retornar todos os funcionários do Banco de Dados
const getListarFuncionarios = async() => {

    try {
        let funcionarioJSON = {}
        let dadosFuncionario = await funcionariosDAO.selectAllFuncionarios()

        if(dadosFuncionario){
            
            if(dadosFuncionario.length > 0) {
                
                funcionarioJSON.funcionarios = dadosFuncionario
                funcionarioJSON.quantidade = dadosFuncionario.length
                funcionarioJSON.status_code = 200
                return funcionarioJSON
            
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

//Função para buscar funcionário pelo id
const getBuscarFuncionario = async(id) => {

    try {
    
        let idFuncionario = id
        let funcionarioJSON = {}

        if(idFuncionario == '' || idFuncionario == undefined || isNaN(idFuncionario)){

            return message.ERROR_INVALID_ID // 400

        } else {

            let dadosFuncionario = await funcionariosDAO.selectByIdFuncionario(idFuncionario)

            if(dadosFuncionario){

                if(dadosFuncionario.length > 0){
                    
                    funcionarioJSON.funcionario = dadosFuncionario
                    funcionarioJSON.status_code = 200
                    return funcionarioJSON

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

//Função para validar um funcionário
const getValidarFuncionario = async(email, senha, contentType) => {

    try {

        if(String(contentType).toLowerCase() == 'application/json'){
    
            let emailFuncionario = email
            let senhaFuncionario = senha
            let funcionarioJSON = {}

            if(emailFuncionario == '' || emailFuncionario == undefined || senhaFuncionario == '' || senhaFuncionario == undefined){

                return message.ERROR_REQUIRED_FIELDS // 400

            } else {

                let dadosFuncionario = await funcionariosDAO.selectValidacaoFuncionario(emailFuncionario, senhaFuncionario)

                if(dadosFuncionario){

                    if(dadosFuncionario.length > 0){         
                        
                        let funcionario = dadosFuncionario

                        funcionarioJSON.status = message.VALIDATED_ITEM.status       
                        funcionarioJSON.status_code = message.VALIDATED_ITEM.status_code       
                        funcionarioJSON.message = message.VALIDATED_ITEM.message       
                        funcionarioJSON.funcionario = funcionario
                
                        return funcionarioJSON
                    } else {
                        return message.ERROR_NOT_FOUND // 404
                    }

                } else {
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

module.exports = {
    setNovoFuncionario,
    setAtualizarFuncionario,
    setAtualizarFuncionarioSenha,
    setExcluirFuncionario,
    getListarFuncionarios,
    getBuscarFuncionario,
    getValidarFuncionario
}