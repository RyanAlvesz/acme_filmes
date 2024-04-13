/****************************************************************************************************************************************************
* Objetivo: Arquivo responsável pela interação entre o APP e a Model, que teremos todas as trativas e regras de negócio para o CRUD de foto de perfil
* Data: 09/04/2024
* Autor: Ryan Alves
* Versão: 1.0
****************************************************************************************************************************************************/

const fotosPerfilDAO = require('../model/DAO/foto-perfil.js')
const message = require('../modulo/config.js')

const controllerCategoriasFotoPerfil = require('./controller-categoria-foto-perfil.js')

//Função para inserir uma nova foto de perfil no Banco de Dados
const setNovaFotoPerfil = async (dadosFotoPerfil, contentType) => {

    try {

        if (String(contentType).toLowerCase() == 'application/json') {

            let resultDadosFotoPerfil = {}
            let validacaoCategoriaFotoPerfil = await controllerCategoriasFotoPerfil.getBuscarCategoriaFotoPerfil(dadosFotoPerfil.id_categoria_foto_perfil)
        
            if( dadosFotoPerfil.foto == ''                     || dadosFotoPerfil.foto == undefined                     || dadosFotoPerfil.foto.length > 65535 ||
                dadosFotoPerfil.nome == ''                     || dadosFotoPerfil.nome == undefined                     || dadosFotoPerfil.nome.length > 50    ||
                dadosFotoPerfil.id_categoria_foto_perfil == '' || dadosFotoPerfil.id_categoria_foto_perfil == undefined ||
                validacaoCategoriaFotoPerfil.status == false
            ) {
                
                return message.ERROR_REQUIRED_FIELDS // 400  
                
            } else {
                
                //Envia os dados para a model inserir no BD
                let novaFotoPerfil = await fotosPerfilDAO.insertFotoPerfil(dadosFotoPerfil)
                
                let id = await fotosPerfilDAO.selectLastId()
                let categoria = await controllerCategoriasFotoPerfil.getBuscarCategoriaFotoPerfil(dadosFotoPerfil.id_categoria_foto_perfil)

                dadosFotoPerfil.nome_categoria = categoria.categoria[0].nome
                dadosFotoPerfil.id = Number(id[0].id)

                //Valida se o BD inseriu corretamente os dados
                if (novaFotoPerfil) {

                    resultDadosFotoPerfil.status = message.CREATED_ITEM.status
                    resultDadosFotoPerfil.status_code = message.CREATED_ITEM.status_code
                    resultDadosFotoPerfil.message = message.CREATED_ITEM.message
                    resultDadosFotoPerfil.foto = dadosFotoPerfil
                    return resultDadosFotoPerfil

                } else {

                    return message.ERROR_INTERNAL_SERVER_DB // 500

                }

            }

        } else {
            return message.ERROR_CONTENT_TYPE // 415
        }

    } catch (error) {
        return message.ERROR_INTERNAL_SERVER // 500
    }

}

//Função para atualizar uma foto de perfil existente
const setAtualizarFotoPerfil = async (dadosFotoPerfil, contentType, idFotoPerfil) => {

    try {

        if (String(contentType).toLowerCase() == 'application/json') {

            let resultDadosFotoPerfil = {}
            let validacaoCategoriaFotoPerfil = await controllerCategoriasFotoPerfil.getBuscarCategoriaFotoPerfil(dadosFotoPerfil.id_categoria_foto_perfil)

            if( idFotoPerfil == ''                             || idFotoPerfil == undefined                             ||
                dadosFotoPerfil.foto == ''                     || dadosFotoPerfil.foto == undefined                     || dadosFotoPerfil.foto.length > 65535 ||
                dadosFotoPerfil.nome == ''                     || dadosFotoPerfil.nome == undefined                     || dadosFotoPerfil.nome.length > 50    ||
                dadosFotoPerfil.id_categoria_foto_perfil == '' || dadosFotoPerfil.id_categoria_foto_perfil == undefined || 
                validacaoCategoriaFotoPerfil.status == false 
            ) {

                return message.ERROR_REQUIRED_FIELDS // 400

            } else {

                let fotoPerfilAtualizada = await fotosPerfilDAO.updateFotoPerfil(dadosFotoPerfil, idFotoPerfil)
                let categoria = await controllerCategoriasFotoPerfil.getBuscarCategoriaFotoPerfil(dadosFotoPerfil.id_categoria_foto_perfil)

                dadosFotoPerfil.categoria = categoria.categoria[0].nome
                dadosFotoPerfil.id = idFotoPerfil
                
                if (fotoPerfilAtualizada) {
                    resultDadosFotoPerfil.status = message.UPDATED_ITEM.status
                    resultDadosFotoPerfil.status_code = message.UPDATED_ITEM.status_code
                    resultDadosFotoPerfil.message = message.UPDATED_ITEM.message
                    resultDadosFotoPerfil.foto = dadosFotoPerfil
                    return resultDadosFotoPerfil
                } else {

                    return message.ERROR_INTERNAL_SERVER_DB // 500

                }

            }

        } else {
            return message.ERROR_CONTENT_TYPE // 415
        }

    } catch (error) {
        message.ERROR_INTERNAL_SERVER // 500
    }

}

//Função para excluir uma foto de perfil existente
const setExcluirFotoPerfil = async (id) => {

    try {

        let idFotoPerfil = id
        let validacaoFotoPerfil = await getBuscarFotoPerfil(idFotoPerfil)

        if (idFotoPerfil == '' || idFotoPerfil == undefined || isNaN(idFotoPerfil)) {

            return message.ERROR_INVALID_ID // 400

        } else if (validacaoFotoPerfil.status == false) {

            return message.ERROR_NOT_FOUND // 404

        } else {

            let dadosFotoPerfil = await fotosPerfilDAO.deleteFotoPerfil(idFotoPerfil)

            if (dadosFotoPerfil) {
                return message.DELETED_ITEM // 200
            } else {
                return message.ERROR_INTERNAL_SERVER_DB // 500
            }

        }

    } catch (error) {
        message.ERROR_INTERNAL_SERVER // 500
    }

}

//Função para retornar todos as foto de perfil do Banco de Dados
const getListarFotosPerfil = async () => {

    try {
        let fotoPefilJSON = {}
        let dadosFotoPerfil = await fotosPerfilDAO.selectAllFotosPerfil()

        if (dadosFotoPerfil) {

            if (dadosFotoPerfil.length > 0) {

                fotoPefilJSON.fotos = dadosFotoPerfil
                fotoPefilJSON.quantidade = dadosFotoPerfil.length
                fotoPefilJSON.status_code = 200
                return fotoPefilJSON

            } else {
                return message.ERROR_NOT_FOUND // 404
            }

        } else {
            return message.ERROR_INTERNAL_SERVER_DB // 500
        }

    } catch (error) {
        message.ERROR_INTERNAL_SERVER // 500
    }

}

//Função para buscar uma foto de perfil pelo id
const getBuscarFotoPerfil = async (id) => {

    try {

        let idFotoPerfil = id
        let fotoPefilJSON = {}

        if (idFotoPerfil == '' || idFotoPerfil == undefined || isNaN(idFotoPerfil)) {

            return message.ERROR_INVALID_ID // 400

        } else {

            let dadosFotoPerfil = await fotosPerfilDAO.selectByIdFotoPerfil(idFotoPerfil)

            if (dadosFotoPerfil) {

                if (dadosFotoPerfil.length > 0) {

                    fotoPefilJSON.foto = dadosFotoPerfil
                    fotoPefilJSON.status_code = 200
                    return fotoPefilJSON

                } else {
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

//Função para listar fotos de perfil de uma categoria por id
const getListarFotosPerfilCategoria = async (id) => {

    try {

        let idCategoria = id
        let fotoPefilJSON = {}

        if (idCategoria == '' || idCategoria == undefined || isNaN(idCategoria)) {

            return message.ERROR_INVALID_ID // 400

        } else {

            let dadosFotoPerfil = await fotosPerfilDAO.selectAllFotosPerfilByCategoria(idCategoria)

            if (dadosFotoPerfil) {

                if (dadosFotoPerfil.length > 0) {

                    fotoPefilJSON.fotos = dadosFotoPerfil
                    fotoPefilJSON.status_code = 200
                    return fotoPefilJSON

                } else {
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
    setNovaFotoPerfil,
    setAtualizarFotoPerfil,
    setExcluirFotoPerfil,
    getListarFotosPerfil,
    getListarFotosPerfilCategoria,
    getBuscarFotoPerfil
}