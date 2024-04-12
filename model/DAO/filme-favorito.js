/****************************************************************************************************************************************************
* Objetivo: Criar a interação com o Banco de Dados MySQL para fazer CRUD de filmes favoritos
* Data: 09/04/2024
* Autor: Ryan Alves
* Versão: 1.0
****************************************************************************************************************************************************/

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Inserir um filme favorito
const insertFilmeFavorito = async (dadosFilmeFavorito) => {

    try {
        let sql = `insert into tbl_filme_favorito (id_filme, id_perfil) values (${dadosFilmeFavorito.id_filme}, ${dadosFilmeFavorito.id_perfil})`
        let resultStatus = await prisma.$executeRawUnsafe(sql)
        if(resultStatus)
            return true
        else
            return false
    } catch (error) {
        return false
    }

}

// Atualizar um filme favorito existente filtrando pelo ID
const updateFilmeFavorito = async (dadosFilmeFavorito, idFilmeFavorito) => {

    try {
        let sql = `update tbl_filme_favorito set id_filme = ${dadosFilmeFavorito.id_filme}, id_perfil = ${dadosFilmeFavorito.id_perfil} where id = ${idFilmeFavorito}`   
        let resultStatus = await prisma.$executeRawUnsafe(sql)
        if(resultStatus)
            return true
        else
            return false
    } catch (error) {
        return false
    }

}

// Deletar um filme favorito existente filtrando pelo ID
const deleteFilmeFavorito = async (id) => {

    try {
        let sql = `delete from tbl_filme_favorito where id = ${id}`
        let rsFilmeFavorito = await prisma.$executeRawUnsafe(sql)
        return rsFilmeFavorito
    } catch (error) {
        return false
    }

}

// Listar todos os filmes favoritos existentes na tabela
const selectAllFilmesFavoritos = async () => {   

    try {
        let sql = 'select tff.id, tff.id_filme, tf.nome as filme, tff.id_perfil, tp.apelido as perfil, tu.id as id_usuario, tu.nome as usuario from tbl_filme_favorito as tff inner join tbl_filme as tf on tff.id_filme=tf.id inner join tbl_perfil as tp on tff.id_perfil=tp.id inner join tbl_usuario as tu on tp.id_usuario=tu.id order by tff.id desc'
        let rsFilmeFavorito = await prisma.$queryRawUnsafe(sql)
        return rsFilmeFavorito
    } catch (error) {
        return false
    }

}

// Buscar filme favorito filtrando pelo ID
const selectByIdFilmeFavorito = async (id) => {

    try {
        let sql = `select tff.id, tff.id_filme, tf.nome as filme, tff.id_perfil, tp.apelido as perfil, tu.id as id_usuario, tu.nome as usuario from tbl_filme_favorito as tff inner join tbl_filme as tf on tff.id_filme=tf.id inner join tbl_perfil as tp on tff.id_perfil=tp.id inner join tbl_usuario as tu on tp.id_usuario=tu.id where tff.id = ${id}`
        let rsFilmeFavorito = await prisma.$queryRawUnsafe(sql)
        return rsFilmeFavorito
    } catch (error) {
        return false
    }

}

// Buscar o id do último item da tabela
const selectLastId = async () => {
   
    try {
        let sql = 'select cast(last_insert_id() as DECIMAL) as id from tbl_filme_favorito limit 1'
        let rsFilmeFavorito = await prisma.$queryRawUnsafe(sql)
        return rsFilmeFavorito
    } catch (error) {
        return false
    }

}

module.exports = {
    insertFilmeFavorito,
    updateFilmeFavorito,
    deleteFilmeFavorito,
    selectAllFilmesFavoritos,
    selectByIdFilmeFavorito,
    selectLastId
}