/****************************************************************************************************************************************************
* Objetivo: Criar a interação com o Banco de Dados MySQL para fazer CRUD de diretores de filmes
* Data: 09/04/2024
* Autor: Ryan Alves
* Versão: 1.0
****************************************************************************************************************************************************/

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Inserir um novo diretor para um filme
const insertFilmeDiretor = async (dadosFilmeDiretor) => {

    try {
        let sql = `insert into tbl_filme_diretor (id_filme, id_diretor) values (${dadosFilmeDiretor.id_filme}, ${dadosFilmeDiretor.id_diretor})`
        let resultStatus = await prisma.$executeRawUnsafe(sql)
        if(resultStatus)
            return true
        else
            return false
    } catch (error) {
        return false
    }

}

// Atualizar um diretor de um filme existente filtrando pelo ID
const updateFilmeDiretor = async (dadosFilmeDiretor, idFilmeDiretor) => {

    try {
        let sql = `update tbl_filme_diretor set id_filme = ${dadosFilmeDiretor.id_filme}, id_diretor = ${dadosFilmeDiretor.id_diretor} where id = ${idFilmeDiretor}`   
        let resultStatus = await prisma.$executeRawUnsafe(sql)
        if(resultStatus)
            return true
        else
            return false
    } catch (error) {
        return false
    }

}

// Deletar um diretor existente de um filme filtrando pelo ID
const deleteFilmeDiretor = async (id) => {

    try {
        let sql = `delete from tbl_filme_diretor where id = ${id}`
        let rsFilmeDiretor = await prisma.$executeRawUnsafe(sql)
        return rsFilmeDiretor
    } catch (error) {
        return false
    }

}

// Listar todas as relações de filmes e diretores existentes na tabela
const selectAllFilmesDiretores = async () => {   

    try {
        let sql = 'select tfd.id, tfd.id_filme, tf.nome as filme, tfd.id_diretor, td.nome as diretor from tbl_filme_diretor as tfd inner join tbl_filme as tf on tfd.id_filme=tf.id inner join tbl_diretor as td on tfd.id_diretor=td.id order by tfd.id desc'
        let rsFilmeDiretor = await prisma.$queryRawUnsafe(sql)
        return rsFilmeDiretor
    } catch (error) {
        return false
    }

}

// Buscar uma relação de filme e diretor existente filtrando pelo ID
const selectByIdFilmeDiretor = async (id) => {

    try {
        let sql = `select tfd.id, tfd.id_filme, tf.nome as filme, tfd.id_diretor, td.nome as diretor from tbl_filme_diretor as tfd inner join tbl_filme as tf on tfd.id_filme=tf.id inner join tbl_diretor as td on tfd.id_diretor=td.id where tfd.id = ${id}`
        let rsFilmeDiretor = await prisma.$queryRawUnsafe(sql)
        return rsFilmeDiretor
    } catch (error) {
        return false
    }

}

// Buscar o id do último item da tabela
const selectLastId = async () => {
   
    try {
        let sql = 'select cast(last_insert_id() as DECIMAL) as id from tbl_filme_diretor limit 1'
        let rsFilmeDiretor = await prisma.$queryRawUnsafe(sql)
        return rsFilmeDiretor
    } catch (error) {
        return false
    }

}

module.exports = {
    insertFilmeDiretor,
    updateFilmeDiretor,
    deleteFilmeDiretor,
    selectAllFilmesDiretores,
    selectByIdFilmeDiretor,
    selectLastId
}