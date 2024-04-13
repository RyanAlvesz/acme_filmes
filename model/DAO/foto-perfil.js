/****************************************************************************************************************************************************
* Objetivo: Criar a interação com o Banco de Dados MySQL para fazer CRUD de fotos de perfil
* Data: 09/04/2024
* Autor: Ryan Alves
* Versão: 1.0
****************************************************************************************************************************************************/

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Inserir uma nova foto de perfil
const insertFotoPerfil = async (dadosFotoPerfil) => {

    try {
        let sql = `insert into tbl_foto_perfil (foto, nome, id_categoria_foto_perfil) values ('${dadosFotoPerfil.foto}', '${dadosFotoPerfil.nome}', ${dadosFotoPerfil.id_categoria_foto_perfil})`
        let resultStatus = await prisma.$executeRawUnsafe(sql)
        if(resultStatus)
            return true
        else
            return false
    } catch (error) {
        return false
    }

}

// Atualizar uma foto de perfil existente filtrando pelo ID
const updateFotoPerfil = async (dadosFotoPerfil, idFotoPerfil) => {

    try {
        let sql = `update tbl_foto_perfil set foto = '${dadosFotoPerfil.foto}', nome = '${dadosFotoPerfil.nome}', id_categoria_foto_perfil = ${dadosFotoPerfil.id_categoria_foto_perfil} where id = ${idFotoPerfil}`   
        let resultStatus = await prisma.$executeRawUnsafe(sql)
        if(resultStatus)
            return true
        else
            return false
    } catch (error) {
        return false
    }

}

// Deletar uma foto de perfil existente filtrando pelo ID
const deleteFotoPerfil = async (id) => {

    try {
        let sql = `delete from tbl_foto_perfil where id = ${id}`
        let rsFotoPerfil = await prisma.$executeRawUnsafe(sql)
        return rsFotoPerfil
    } catch (error) {
        return false
    }

}

// Listar todas as fotos de perfil existentes na tabela
const selectAllFotosPerfil = async () => {   

    try {
        let sql = 'select tf.id, tf.foto, tf.nome, tc.nome as categoria, tf.id_categoria_foto_perfil as id_categoria from tbl_foto_perfil as tf inner join tbl_categoria_foto_perfil as tc on tf.id_categoria_foto_perfil=tc.id order by id desc'
        let rsFotoPerfil = await prisma.$queryRawUnsafe(sql)
        return rsFotoPerfil
    } catch (error) {
        return false
    }

}

// Buscar uma foto de perfil existente filtrando pelo ID
const selectByIdFotoPerfil = async (id) => {

    try {
        let sql = `select tf.id, tf.foto, tf.nome, tc.nome as categoria, tf.id_categoria_foto_perfil as id_categoria from tbl_foto_perfil as tf inner join tbl_categoria_foto_perfil as tc on tf.id_categoria_foto_perfil=tc.id where tf.id = ${id}`
        let rsFotoPerfil = await prisma.$queryRawUnsafe(sql)
        return rsFotoPerfil
    } catch (error) {
        return false
    }

}

// Buscar as foto de perfil de uma categoria filtrando pelo ID
const selectAllFotosPerfilByCategoria = async (id) => {

    try {
        let sql = `select tf.id, tf.foto, tf.nome, tc.nome as categoria, tf.id_categoria_foto_perfil as id_categoria from tbl_foto_perfil as tf inner join tbl_categoria_foto_perfil as tc on tf.id_categoria_foto_perfil=tc.id where tc.id = ${id}`
        let rsFotoPerfil = await prisma.$queryRawUnsafe(sql)
        return rsFotoPerfil
    } catch (error) {
        return false
    }

}

// Buscar o id do último item da tabela
const selectLastId = async () => {
   
    try {
        let sql = 'select cast(last_insert_id() as DECIMAL) as id from tbl_foto_perfil limit 1'
        let rsFotoPerfil = await prisma.$queryRawUnsafe(sql)
        return rsFotoPerfil
    } catch (error) {
        return false
    }

}

module.exports = {
    insertFotoPerfil,
    updateFotoPerfil,
    deleteFotoPerfil,
    selectAllFotosPerfil,
    selectByIdFotoPerfil,
    selectAllFotosPerfilByCategoria,
    selectLastId
}