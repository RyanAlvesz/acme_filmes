/****************************************************************************************************************************************************
* Objetivo: Criar a interação com o Banco de Dados MySQL para fazer CRUD de gêneros de filmes
* Data: 09/04/2024
* Autor: Ryan Alves
* Versão: 1.0
****************************************************************************************************************************************************/

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Inserir um novo gênero para um filme
const insertFilmeGenero = async (dadosFilmeGenero) => {

    try {
        let sql = `insert into tbl_filme_genero (id_filme, id_genero) values (${dadosFilmeGenero.id_filme}, ${dadosFilmeGenero.id_genero})`
        let resultStatus = await prisma.$executeRawUnsafe(sql)
        if(resultStatus)
            return true
        else
            return false
    } catch (error) {
        return false
    }

}

// Atualizar um gênero de um filme existente filtrando pelo ID
const updateFilmeGenero = async (dadosFilmeGenero, idFilmeGenero) => {

    try {
        let sql = `update tbl_filme_genero set id_filme = ${dadosFilmeGenero.id_filme}, id_genero = ${dadosFilmeGenero.id_genero} where id = ${idFilmeGenero}`   
        let resultStatus = await prisma.$executeRawUnsafe(sql)
        if(resultStatus)
            return true
        else
            return false
    } catch (error) {
        return false
    }

}

// Deletar um gênero existente de um filme filtrando pelo ID
const deleteFilmeGenero = async (id) => {

    try {
        let sql = `delete from tbl_filme_genero where id = ${id}`
        let rsFilmeGenero = await prisma.$executeRawUnsafe(sql)
        return rsFilmeGenero
    } catch (error) {
        return false
    }

}

// Listar todas as relações de filmes e gêneros existentes na tabela
const selectAllFilmesGeneros = async () => {   

    try {
        let sql = 'select tfg.id, tfg.id_filme, tf.nome as filme, tfg.id_genero, tg.nome as genero from tbl_filme_genero as tfg inner join tbl_filme as tf on tfg.id_filme=tf.id inner join tbl_genero as tg on tfg.id_genero=tg.id order by tfg.id desc'
        let rsFilmeGenero = await prisma.$queryRawUnsafe(sql)
        return rsFilmeGenero
    } catch (error) {
        return false
    }

}

// Buscar uma relação de filme e gênero existente filtrando pelo ID
const selectByIdFilmeGenero = async (id) => {

    try {
        let sql = `select tfg.id, tfg.id_filme, tf.nome as filme, tfg.id_genero, tg.nome as genero from tbl_filme_genero as tfg inner join tbl_filme as tf on tfg.id_filme=tf.id inner join tbl_genero as tg on tfg.id_genero=tg.id where tfg.id = ${id}`
        let rsFilmeGenero = await prisma.$queryRawUnsafe(sql)
        return rsFilmeGenero
    } catch (error) {
        return false
    }

}

// Buscar o id do último item da tabela
const selectLastId = async () => {
   
    try {
        let sql = 'select cast(last_insert_id() as DECIMAL) as id from tbl_filme_genero limit 1'
        let rsFilmeGenero = await prisma.$queryRawUnsafe(sql)
        return rsFilmeGenero
    } catch (error) {
        return false
    }

}

module.exports = {
    insertFilmeGenero,
    updateFilmeGenero,
    deleteFilmeGenero,
    selectAllFilmesGeneros,
    selectByIdFilmeGenero,
    selectLastId
}