/****************************************************************************************************************************************************
* Objetivo: Arquivo responsável pela interação entre o APP e a Model, que teremos todas as trativas e regras de negócio para o CRUD de perfis
* Data: 09/04/2024
* Autor: Ryan Alves
* Versão: 1.0
****************************************************************************************************************************************************/

const perfisDAO = require('../model/DAO/perfil.js')
const message = require('../modulo/config.js')

const controllerFotosPerfil = require('./controller-foto-perfil.js')
const controllerUsuarios    = require('./controller-usuario.js')

//Função para inserir um novo perfil no Banco de Dados
const setNovoPerfil = async(dadosPerfil, contentType) => {

    try {
     
        if(String(contentType).toLowerCase() == 'application/json'){

            let resultDadosPerfil = {}
            let usuario = await controllerUsuarios.getBuscarUsuario(dadosPerfil.id_usuario)
            let fotoPerfil = await controllerFotosPerfil.getBuscarFotoPerfil(dadosPerfil.id_foto_perfil)

            if( dadosPerfil.apelido == ''        || dadosPerfil.apelido == undefined        || dadosPerfil.apelido.length > 80  ||
                dadosPerfil.id_usuario == ''     || dadosPerfil.id_usuario == undefined     || 
                dadosPerfil.id_foto_perfil == '' || dadosPerfil.id_foto_perfil == undefined || 
                fotoPerfil.status == false       ||
                usuario.status == false
            ){

                return message.ERROR_REQUIRED_FIELDS // 400  

            }else{

                //Envia os dados para a model inserir no BD
                let novoPerfil = await perfisDAO.insertPerfil(dadosPerfil)
                let id = await perfisDAO.selectLastId()
        
                dadosPerfil.usuario = [
                    {
                        nome: usuario.usuario[0].nome,
                        email: usuario.usuario[0].email,
                    }
                ]

                dadosPerfil.foto_perfil = [
                    {
                        foto: fotoPerfil.foto[0].foto,
                        nome_categoria: fotoPerfil.foto[0].nome_categoria,
                    }
                ]

                dadosPerfil.id = Number(id[0].id)

                //Valida se o BD inseriu corretamente os dados
                if(novoPerfil){

                    resultDadosPerfil.status = message.CREATED_ITEM.status
                    resultDadosPerfil.status_code = message.CREATED_ITEM.status_code
                    resultDadosPerfil.message = message.CREATED_ITEM.message
                    resultDadosPerfil.perfil = dadosPerfil
                    return resultDadosPerfil

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

//Função para atualizar um perfil existente
const setAtualizarPerfil = async(dadosPerfil, contentType, idPerfil) => {

    try {
        
        if(String(contentType).toLowerCase() == 'application/json'){

            let resultDadosPerfil = {}
            let usuario = await controllerUsuarios.getBuscarUsuario(dadosPerfil.id_usuario)
            let fotoPerfil = await controllerFotosPerfil.getBuscarFotoPerfil(dadosPerfil.id_foto_perfil)

            if( 
                idPerfil == ''                   || idPerfil == undefined                   ||
                dadosPerfil.apelido == ''        || dadosPerfil.apelido == undefined        || dadosPerfil.apelido.length > 80        ||
                dadosPerfil.id_usuario == ''     || dadosPerfil.id_usuario == undefined     || 
                dadosPerfil.id_foto_perfil == '' || dadosPerfil.id_foto_perfil == undefined || 
                fotoPerfil.status == false       ||
                usuario.status == false
            ){
                
                return message.ERROR_REQUIRED_FIELDS // 400
                
            }else{
                
                let perfilAtualizado = await perfisDAO.updatePerfil(dadosPerfil, idPerfil)

                dadosPerfil.usuario = [
                    {
                        nome: usuario.usuario[0].nome,
                        email: usuario.usuario[0].email,
                    }
                ]

                dadosPerfil.fotoPerfil = [
                    {
                        foto: fotoPerfil.foto[0].foto,
                        nome_categoria: fotoPerfil.foto[0].nome_categoria,
                    }
                ]

                dadosPerfil.id = idPerfil

                if(perfilAtualizado){
                    resultDadosPerfil.status = message.UPDATED_ITEM.status
                    resultDadosPerfil.status_code = message.UPDATED_ITEM.status_code
                    resultDadosPerfil.message = message.UPDATED_ITEM.message
                    resultDadosPerfil.perfil = dadosPerfil
                    return resultDadosPerfil
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

//Função para excluir um perfil existente
const setExcluirPerfil = async(id) => {

    try {
        
        let idPerfil = id
        let validacaoPerfil = await getBuscarPerfil(idPerfil)

        if(idPerfil == '' || idPerfil == undefined || isNaN(idPerfil)){
            
            return message.ERROR_INVALID_ID // 400
            
        } else if (validacaoPerfil.status == false) {
            
            return message.ERROR_NOT_FOUND // 404
            
        } else {
            
            let dadosPerfil = await perfisDAO.deletePerfil(idPerfil)
            
            if(dadosPerfil){                
                return message.DELETED_ITEM // 200
            } else {
                return message.ERROR_INTERNAL_SERVER_DB // 500
            }

        }

    } catch (error) {
        message.ERROR_INTERNAL_SERVER // 500
    }

}

//Função para retornar todos os perfis do Banco de Dados
const getListarPerfis = async() => {

    try {
        let perfilJSON = {}
        let dadosPerfil = await perfisDAO.selectAllPerfis()

        if(dadosPerfil){
            
            if(dadosPerfil.length > 0) {
                
                perfilJSON.perfis = dadosPerfil
                perfilJSON.quantidade = dadosPerfil.length
                perfilJSON.status_code = 200
                return perfilJSON
            
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

//Função para buscar perfil pelo id
const getBuscarPerfil = async(id) => {

    try {
    
        let idPerfil = id
        let perfilJSON = {}

        if(idPerfil == '' || idPerfil == undefined || isNaN(idPerfil)){

            return message.ERROR_INVALID_ID // 400

        } else {

            let dadosPerfil = await perfisDAO.selectByIdPerfil(idPerfil)

            if(dadosPerfil){

                if(dadosPerfil.length > 0){
                    
                    perfilJSON.perfil = dadosPerfil
                    perfilJSON.status_code = 200
                    return perfilJSON

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

//Função para buscar todos os perfis de um usuário pelo id
const getListarPerfisUsuario = async(id) => {

    try {
    
        let idUsuario = id
        let perfilJSON = {}

        if(idUsuario == '' || idUsuario == undefined || isNaN(idUsuario)){

            return message.ERROR_INVALID_ID // 400

        } else {

            let dadosPerfil = await perfisDAO.selectAllPerfisByIdUsuario(idUsuario)

            if(dadosPerfil){

                if(dadosPerfil.length > 0){
                    
                    perfilJSON.perfis = dadosPerfil
                    perfilJSON.status_code = 200
                    return perfilJSON

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
    setNovoPerfil,
    setAtualizarPerfil,
    setExcluirPerfil,
    getListarPerfis,
    getBuscarPerfil,
    getListarPerfisUsuario
}