/****************************************************************************************************************************************************
* Objetivo: Criar a interação com o Banco de Dados MySQL para fazer CRUD de perfis
* Data: 09/04/2024
* Autor: Ryan Alves
* Versão: 1.0
****************************************************************************************************************************************************/

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Inserir um novo perfil
const insertPerfil = async (dadosPerfil) => {

    try {
        let sql = `insert into tbl_perfil (apelido, id_usuario, id_foto_perfil) values ('${dadosPerfil.apelido}', ${dadosPerfil.id_usuario}, ${dadosPerfil.id_foto_perfil})`
        let resultStatus = await prisma.$executeRawUnsafe(sql)
        if(resultStatus)
            return true
        else
            return false
    } catch (error) {
        return false
    }

}

// Atualizar um perfil existente filtrando pelo ID
const updatePerfil = async (dadosPerfil, idPerfil) => {

    try {
        let sql = `update tbl_perfil set apelido = '${dadosPerfil.apelido}', id_usuario = ${dadosPerfil.id_usuario}, id_foto_perfil = ${dadosPerfil.id_foto_perfil} where id = ${idPerfil}`   
        let resultStatus = await prisma.$executeRawUnsafe(sql)
        if(resultStatus)
            return true
        else
            return false
    } catch (error) {
        return false
    }

}

// Deletar um perfil existente filtrando pelo ID
const deletePerfil = async (id) => {

    try {
        let sql = `delete from tbl_perfil where id = ${id}`
        let rsPerfil = await prisma.$executeRawUnsafe(sql)
        return rsPerfil
    } catch (error) {
        return false
    }

}

// Listar todos os perfis existentes na tabela
const selectAllPerfis = async () => {   

    try {
        let sql = 'select tp.id, tp.apelido, tp.id_usuario, tu.nome as usuario, tp.id_foto_perfil, tf.foto as foto_perfil, tc.nome as categoria_foto_perfil from tbl_perfil as tp inner join tbl_usuario as tu on tp.id_usuario=tu.id inner join tbl_foto_perfil as tf on tp.id_foto_perfil=tf.id inner join tbl_categoria_foto_perfil as tc on tf.id_categoria_foto_perfil=tc.id order by tp.id desc'
        let rsPerfil = await prisma.$queryRawUnsafe(sql)
        return rsPerfil
    } catch (error) {
        return false
    }

}

// Buscar um perfil existente filtrando pelo ID
const selectByIdPerfil = async (id) => {

    try {
        let sql = `select tp.id, tp.apelido, tp.id_usuario, tu.nome as usuario, tp.id_foto_perfil, tf.foto as foto_perfil, tc.nome as categoria_foto_perfil from tbl_perfil as tp inner join tbl_usuario as tu on tp.id_usuario=tu.id inner join tbl_foto_perfil as tf on tp.id_foto_perfil=tf.id inner join tbl_categoria_foto_perfil as tc on tf.id_categoria_foto_perfil=tc.id where tp.id = ${id}`
        let rsPerfil = await prisma.$queryRawUnsafe(sql)
        return rsPerfil
    } catch (error) {
        return false
    }

}

// Buscar perfis de um usuário filtrando pelo ID
const selectAllPerfisByIdUsuario = async (id) => {

    try {
        let sql = `select tp.id, tp.apelido, tp.id_usuario, tu.nome as usuario, tp.id_foto_perfil, tf.foto as foto_perfil, tc.nome as categoria_foto_perfil from tbl_perfil as tp inner join tbl_usuario as tu on tp.id_usuario=tu.id inner join tbl_foto_perfil as tf on tp.id_foto_perfil=tf.id inner join tbl_categoria_foto_perfil as tc on tf.id_categoria_foto_perfil=tc.id where tp.id_usuario = ${id}`
        let rsPerfil = await prisma.$queryRawUnsafe(sql)
        return rsPerfil
    } catch (error) {
        return false
    }

}

// Buscar o id do último item da tabela
const selectLastId = async () => {
   
    try {
        let sql = 'select cast(last_insert_id() as DECIMAL) as id from tbl_perfil limit 1'
        let rsPerfil = await prisma.$queryRawUnsafe(sql)
        return rsPerfil
    } catch (error) {
        return false
    }

}

module.exports = {
    insertPerfil,
    updatePerfil,
    deletePerfil,
    selectAllPerfis,
    selectByIdPerfil,
    selectAllPerfisByIdUsuario,
    selectLastId
}