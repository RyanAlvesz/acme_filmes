/****************************************************************************************************************************************************
* Objetivo: Arquivo responsável pela interação entre o APP e a Model, que teremos todas as trativas e regras de negócio para o CRUD de filmes favoritos
* Data: 09/04/2024
* Autor: Ryan Alves
* Versão: 1.0
****************************************************************************************************************************************************/

const filmesFavoritosDAO = require('../model/DAO/filme-favorito.js')
const message = require('../modulo/config.js')

const controllerFilmes = require('./controller-filme.js')
const controllerPerfis = require('./controller-perfil.js')
const controllerUsuarios = require('./controller-usuario.js')

//Função para inserir um novo filme favorito no Banco de Dados
const setNovoFilmeFavorito = async(dadosFilmeFavorito, contentType) => {

    try {
     
        if(String(contentType).toLowerCase() == 'application/json'){

            let resultDadosFilmeFavorito = {}

            let filme = await controllerFilmes.getBuscarFilme(dadosFilmeFavorito.id_filme)
            let perfil = await controllerPerfis.getBuscarPerfil(dadosFilmeFavorito.id_perfil)
            let usuario = await controllerUsuarios.getBuscarUsuario(perfil.perfil[0].id_usuario)


            if(
                dadosFilmeFavorito.id_filme == ''   || dadosFilmeFavorito.id_filme == undefined   ||
                dadosFilmeFavorito.id_perfil == ''  || dadosFilmeFavorito.id_perfil == undefined  ||
                filme.status == false               ||
                perfil.status == false                 
            ){

                return message.ERROR_REQUIRED_FIELDS // 400  

            }else{

                //Envia os dados para a model inserir no BD
                let novoFilmeFavorito = await filmesFavoritosDAO.insertFilmeFavorito(dadosFilmeFavorito)
                
                let id = await filmesFavoritosDAO.selectLastId()
                
                dadosFilmeFavorito.filme = filme.filme[0].nome
                dadosFilmeFavorito.perfil = perfil.perfil[0].apelido
                dadosFilmeFavorito.id_usuario = usuario.usuario[0].id
                dadosFilmeFavorito.usuario = usuario.usuario[0].nome
                dadosFilmeFavorito.id = Number(id[0].id)
                
                //Valida se o BD inseriu corretamente os dados
                if(novoFilmeFavorito){

                    resultDadosFilmeFavorito.status = message.CREATED_ITEM.status
                    resultDadosFilmeFavorito.status_code = message.CREATED_ITEM.status_code
                    resultDadosFilmeFavorito.message = message.CREATED_ITEM.message
                    resultDadosFilmeFavorito.filme_favorito = dadosFilmeFavorito
                    return resultDadosFilmeFavorito

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

//Função para atualizar um filme favorito existente
const setAtualizarFilmeFavorito = async(dadosFilmeFavorito, contentType, idFilmeFavorito) => {

    try {
        
        if(String(contentType).toLowerCase() == 'application/json'){

            let resultDadosFilmeFavorito = {}
            let filme = await controllerFilmes.getBuscarFilme(dadosFilmeFavorito.id_filme)
            let perfil = await controllerPerfis.getBuscarPerfil(dadosFilmeFavorito.id_perfil)
            let usuario = await controllerUsuarios.getBuscarUsuario(perfil.perfil[0].id_usuario)
        
            if( 
                idFilmeFavorito == ''               || idFilmeFavorito == undefined               ||
                dadosFilmeFavorito.id_filme == ''   || dadosFilmeFavorito.id_filme == undefined   ||
                dadosFilmeFavorito.id_perfil == ''  || dadosFilmeFavorito.id_perfil == undefined  ||
                filme.status == false               ||
                perfil.status == false        
            ){
                
                return message.ERROR_REQUIRED_FIELDS // 400
                
            }else{
                
                let filmeFavoritoAtualizado = await filmesFavoritosDAO.updateFilmeFavorito(dadosFilmeFavorito, idFilmeFavorito)
                                        
                dadosFilmeFavorito.filme = filme.filme[0].nome
                dadosFilmeFavorito.perfil = perfil.perfil[0].apelido
                dadosFilmeFavorito.id_usuario = usuario.usuario[0].id
                dadosFilmeFavorito.usuario = usuario.usuario[0].nome
                dadosFilmeFavorito.id = idFilmeFavorito

                if(filmeFavoritoAtualizado){
                    resultDadosFilmeFavorito.status = message.UPDATED_ITEM.status
                    resultDadosFilmeFavorito.status_code = message.UPDATED_ITEM.status_code
                    resultDadosFilmeFavorito.message = message.UPDATED_ITEM.message
                    resultDadosFilmeFavorito.filme_favorito = dadosFilmeFavorito
                    return resultDadosFilmeFavorito
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

//Função para excluir um filme favorito existente
const setExcluirFilmeFavorito = async(id) => {

    try {
        
        let idFilmeFavorito = id
        let validacaoFilmeFavorito = await getBuscarFilmeFavorito(idFilmeFavorito)

        if(idFilmeFavorito == '' || idFilmeFavorito == undefined || isNaN(idFilmeFavorito)){
            
            return message.ERROR_INVALID_ID // 400
            
        } else if (validacaoFilmeFavorito.status == false) {
            
            return message.ERROR_NOT_FOUND // 404
            
        } else {
            
            let dadosFilmeFavorito = await filmesFavoritosDAO.deleteFilmeFavorito(idFilmeFavorito)
            
            if(dadosFilmeFavorito){                
                return message.DELETED_ITEM // 200
            } else {
                return message.ERROR_INTERNAL_SERVER_DB // 500
            }

        }

    } catch (error) {
        message.ERROR_INTERNAL_SERVER // 500
    }

}

//Função para retornar todas os filmes favoritos do Banco de Dados
const getListarFilmesFavorito = async() => {

    try {
        let filmeFavoritoJSON = {}
        let dadosFilmeFavorito = await filmesFavoritosDAO.selectAllFilmesFavoritos()

        if(dadosFilmeFavorito){
            
            if(dadosFilmeFavorito.length > 0) {
                
                filmeFavoritoJSON.filmes_favoritos = dadosFilmeFavorito
                filmeFavoritoJSON.quantidade = dadosFilmeFavorito.length
                filmeFavoritoJSON.status_code = 200
                return filmeFavoritoJSON
            
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

//Função para buscar im filme favorito pelo id
const getBuscarFilmeFavorito = async(id) => {

    try {
    
        let idFilmeFavorito = id
        let filmeFavoritoJSON = {}

        if(idFilmeFavorito == '' || idFilmeFavorito == undefined || isNaN(idFilmeFavorito)){

            return message.ERROR_INVALID_ID // 400

        } else {

            let dadosFilmeFavorito = await filmesFavoritosDAO.selectByIdFilmeFavorito(idFilmeFavorito)

            if(dadosFilmeFavorito){

                if(dadosFilmeFavorito.length > 0){
                    
                    filmeFavoritoJSON.filme_favorito = dadosFilmeFavorito
                    filmeFavoritoJSON.status_code = 200
                    return filmeFavoritoJSON

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
    setNovoFilmeFavorito,
    setAtualizarFilmeFavorito,
    setExcluirFilmeFavorito,
    getListarFilmesFavorito,
    getBuscarFilmeFavorito
}