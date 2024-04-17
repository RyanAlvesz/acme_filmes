/****************************************************************************************************************************************************
* Objetivo: Arquivo responsável pela interação entre o APP e a Model, que teremos todas as trativas e regras de negócio para o CRUD de usuários
* Data: 09/04/2024
* Autor: Ryan Alves
* Versão: 1.0
****************************************************************************************************************************************************/

const usuariosDAO = require('../model/DAO/usuario.js')
const message = require('../modulo/config.js')

//Função para inserir um novo usuário no Banco de Dados
const setNovoUsuario = async(dadosUsuario, contentType) => {

    try {
     
        if(String(contentType).toLowerCase() == 'application/json'){

            let resultDadosUsuario = {}
        
            if( dadosUsuario.nome == ''  || dadosUsuario.nome == undefined  || dadosUsuario.nome.length > 100  ||
                dadosUsuario.email == '' || dadosUsuario.email == undefined || dadosUsuario.email.length > 100 ||
                dadosUsuario.senha == '' || dadosUsuario.senha == undefined || dadosUsuario.senha.length > 50 
            ){

                return message.ERROR_REQUIRED_FIELDS // 400  

            }else{

                //Envia os dados para a model inserir no BD
                let novoUsuario = await usuariosDAO.insertUsuario(dadosUsuario)
                
                let id = await usuariosDAO.selectLastId()
        
                dadosUsuario.id = Number(id[0].id)
                
                //Valida se o BD inseriu corretamente os dados
                if(novoUsuario){

                    resultDadosUsuario.status = message.CREATED_ITEM.status
                    resultDadosUsuario.status_code = message.CREATED_ITEM.status_code
                    resultDadosUsuario.message = message.CREATED_ITEM.message
                    resultDadosUsuario.usuario = dadosUsuario
                    return resultDadosUsuario

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

//Função para atualizar um usuário existente
const setAtualizarUsuario = async(dadosUsuario, contentType, idUsuario) => {

    try {
        
        if(String(contentType).toLowerCase() == 'application/json'){

            let resultDadosUsuario = {}
        
            if( 
                idUsuario == ''          || idUsuario == undefined          ||
                dadosUsuario.nome == ''  || dadosUsuario.nome == undefined  || dadosUsuario.nome.length > 100  ||
                dadosUsuario.email == '' || dadosUsuario.email == undefined || dadosUsuario.email.length > 100 ||
                dadosUsuario.senha == '' || dadosUsuario.senha == undefined || dadosUsuario.senha.length > 50 
            ){
                
                return message.ERROR_REQUIRED_FIELDS // 400
                
            }else{
                
                let usuarioAtualizado = await usuariosDAO.updateUsuario(dadosUsuario, idUsuario)
                                        
                dadosUsuario.id = idUsuario

                if(usuarioAtualizado){
                    resultDadosUsuario.status = message.UPDATED_ITEM.status
                    resultDadosUsuario.status_code = message.UPDATED_ITEM.status_code
                    resultDadosUsuario.message = message.UPDATED_ITEM.message
                    resultDadosUsuario.usuario = dadosUsuario
                    return resultDadosUsuario
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

//Função para excluir um usuário existente
const setExcluirUsuario = async(id) => {

    try {
        
        let idUsuario = id
        let validacaoUsuario = await getBuscarUsuario(idUsuario)

        if(idUsuario == '' || idUsuario == undefined || isNaN(idUsuario)){
            
            return message.ERROR_INVALID_ID // 400
            
        } else if (validacaoUsuario.status == false) {
            
            return message.ERROR_NOT_FOUND // 404
            
        } else {
            
            let dadosUsuario = await usuariosDAO.deleteUsuario(idUsuario)
            
            if(dadosUsuario){                
                return message.DELETED_ITEM // 200
            } else {
                return message.ERROR_INTERNAL_SERVER_DB // 500
            }

        }

    } catch (error) {
        message.ERROR_INTERNAL_SERVER // 500
    }

}

//Função para retornar todos os usuários do Banco de Dados
const getListarUsuarios = async() => {

    try {

        let usuarioJSON = {}
        let dadosUsuario = await usuariosDAO.selectAllUsuarios()

        if(dadosUsuario){
            
            if(dadosUsuario.length > 0) {
                
                usuarioJSON.usuarios = dadosUsuario
                usuarioJSON.quantidade = dadosUsuario.length
                usuarioJSON.status_code = 200
                return usuarioJSON
            
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

//Função para buscar usuário pelo id
const getBuscarUsuario = async(id) => {

    try {
    
        let idUsuario = id
        let usuarioJSON = {}

        if(idUsuario == '' || idUsuario == undefined || isNaN(idUsuario)){

            return message.ERROR_INVALID_ID // 400

        } else {

            let dadosUsuario = await usuariosDAO.selectByIdUsuario(idUsuario)

            if(dadosUsuario){

                if(dadosUsuario.length > 0){
                    
                    usuarioJSON.usuario = dadosUsuario
                    usuarioJSON.status_code = 200
                    return usuarioJSON

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

//Função para validar um usuário
const getValidarUsuario = async(email, senha, contentType) => {
    
    try {

        if(String(contentType).toLowerCase() == 'application/json'){
    
            let emailUsuario = email
            let senhaUsuario = senha
            let usuarioJSON = {}

            if(emailUsuario == '' || emailUsuario == undefined || senhaUsuario == '' || senhaUsuario == undefined){

                return message.ERROR_REQUIRED_FIELDS // 400

            } else {

                let dadosUsuario = await usuariosDAO.selectValidacaoUsuario(emailUsuario, senhaUsuario)

                if(dadosUsuario){

                    if(dadosUsuario.length > 0){         

                        let usuario = dadosUsuario

                        usuarioJSON.status = message.VALIDATED_ITEM.status       
                        usuarioJSON.status_code = message.VALIDATED_ITEM.status_code       
                        usuarioJSON.message = message.VALIDATED_ITEM.message       
                        usuarioJSON.usuario = usuario
                
                        return usuarioJSON
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
    setNovoUsuario,
    setAtualizarUsuario,
    setExcluirUsuario,
    getListarUsuarios,
    getBuscarUsuario,
    getValidarUsuario
}