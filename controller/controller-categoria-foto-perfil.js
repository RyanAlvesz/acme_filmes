/****************************************************************************************************************************************************
* Objetivo: Arquivo responsável pela interação entre o APP e a Model, que teremos todas as trativas e regras de negócio para o CRUD de categorias de foto de perfil
* Data: 09/04/2024
* Autor: Ryan Alves
* Versão: 1.0
****************************************************************************************************************************************************/

const categoriasFotoPerfilDAO = require('../model/DAO/categoria-foto-perfil.js')
const message = require('../modulo/config.js')

//Função para inserir uma nova categoria de foto de perfil no Banco de Dados
const setNovaCategoriaFotoPerfil = async (dadosCategoriaFotoPerfil, contentType) => {

    try {

        if (String(contentType).toLowerCase() == 'application/json') {

            let resultDadosCategoriaFotoPerfil = {}

            if (dadosCategoriaFotoPerfil.nome == '' || dadosCategoriaFotoPerfil.nome == undefined || dadosCategoriaFotoPerfil.nome.length > 100) {

                return message.ERROR_REQUIRED_FIELDS // 400  

            } else {

                //Envia os dados para a model inserir no BD
                let novaCategoriaFotoPerfil = await categoriasFotoPerfilDAO.insertCategoriaFotoPerfil(dadosCategoriaFotoPerfil)

                let id = await categoriasFotoPerfilDAO.selectLastId()

                dadosCategoriaFotoPerfil.id = Number(id[0].id)

                //Valida se o BD inseriu corretamente os dados
                if (novaCategoriaFotoPerfil) {

                    resultDadosCategoriaFotoPerfil.status = message.CREATED_ITEM.status
                    resultDadosCategoriaFotoPerfil.status_code = message.CREATED_ITEM.status_code
                    resultDadosCategoriaFotoPerfil.message = message.CREATED_ITEM.message
                    resultDadosCategoriaFotoPerfil.categoria = dadosCategoriaFotoPerfil
                    return resultDadosCategoriaFotoPerfil

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

//Função para atualizar uma categoria de foto de perfil existente
const setAtualizarCategoriaFotoPerfil = async (dadosCategoriaFotoPerfil, contentType, idCategoriaFotoPerfil) => {

    try {

        if (String(contentType).toLowerCase() == 'application/json') {

            let resultDadosCategoriaFotoPerfil = {}

            if (
                idCategoriaFotoPerfil == ''         || idCategoriaFotoPerfil == undefined         ||
                dadosCategoriaFotoPerfil.nome == '' || dadosCategoriaFotoPerfil.nome == undefined || dadosCategoriaFotoPerfil.nome.length > 100
            ) {

                return message.ERROR_REQUIRED_FIELDS // 400

            } else {

                let categoriaFotoPerfilAtualizada = await categoriasFotoPerfilDAO.updateCategoriaFotoPerfil(dadosCategoriaFotoPerfil, idCategoriaFotoPerfil)

                dadosCategoriaFotoPerfil.id = idCategoriaFotoPerfil

                if (categoriaFotoPerfilAtualizada) {
                    resultDadosCategoriaFotoPerfil.status = message.UPDATED_ITEM.status
                    resultDadosCategoriaFotoPerfil.status_code = message.UPDATED_ITEM.status_code
                    resultDadosCategoriaFotoPerfil.message = message.UPDATED_ITEM.message
                    resultDadosCategoriaFotoPerfil.categoria = dadosCategoriaFotoPerfil
                    return resultDadosCategoriaFotoPerfil
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

//Função para excluir uma categoria de foto de perfil existente
const setExcluirCategoriaFotoPerfil = async (id) => {

    try {

        let idCategoriaFotoPerfil = id
        let validacaoCategoriaFotoPerfil = await getBuscarCategoriaFotoPerfil(idCategoriaFotoPerfil)

        if (idCategoriaFotoPerfil == '' || idCategoriaFotoPerfil == undefined || isNaN(idCategoriaFotoPerfil)) {

            return message.ERROR_INVALID_ID // 400

        } else if (validacaoCategoriaFotoPerfil.status == false) {

            return message.ERROR_NOT_FOUND // 404

        } else {

            let dadosCategoriaFotoPerfil = await categoriasFotoPerfilDAO.deleteCategoriaFotoPerfil(idCategoriaFotoPerfil)

            if (dadosCategoriaFotoPerfil) {
                return message.DELETED_ITEM // 200
            } else {
                return message.ERROR_INTERNAL_SERVER_DB // 500
            }

        }

    } catch (error) {
        message.ERROR_INTERNAL_SERVER // 500
    }

}

//Função para retornar todos as categorias de foto de perfil do Banco de Dados
const getListarCategoriasFotoPerfil = async () => {

    try {
        let categoriaFotoPefilJSON = {}
        let dadosCategoriaFotoPerfil = await categoriasFotoPerfilDAO.selectAllCategoriaFotoPeril()

        if (dadosCategoriaFotoPerfil) {

            if (dadosCategoriaFotoPerfil.length > 0) {

                categoriaFotoPefilJSON.categorias = dadosCategoriaFotoPerfil
                categoriaFotoPefilJSON.quantidade = dadosCategoriaFotoPerfil.length
                categoriaFotoPefilJSON.status_code = 200
                return categoriaFotoPefilJSON

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

//Função para buscar uma categoria de foto de perfil pelo id
const getBuscarCategoriaFotoPerfil = async (id) => {

    try {

        let idCategoriaFotoPerfil = id
        let categoriaFotoPefilJSON = {}

        if (idCategoriaFotoPerfil == '' || idCategoriaFotoPerfil == undefined || isNaN(idCategoriaFotoPerfil)) {

            return message.ERROR_INVALID_ID // 400

        } else {

            let dadosCategoriaFotoPerfil = await categoriasFotoPerfilDAO.selectByIdCategoriaFotoPerfil(idCategoriaFotoPerfil)

            if (dadosCategoriaFotoPerfil) {

                if (dadosCategoriaFotoPerfil.length > 0) {

                    categoriaFotoPefilJSON.categoria = dadosCategoriaFotoPerfil
                    categoriaFotoPefilJSON.status_code = 200
                    return categoriaFotoPefilJSON

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
    setNovaCategoriaFotoPerfil,
    setAtualizarCategoriaFotoPerfil,
    setExcluirCategoriaFotoPerfil,
    getListarCategoriasFotoPerfil,
    getBuscarCategoriaFotoPerfil
}