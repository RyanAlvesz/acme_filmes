/****************************************************************************************************************************************************
* Objetivo: Criar a interação com o Banco de Dados MySQL para fazer CRUD de atores de filmes
* Data: 09/04/2024
* Autor: Ryan Alves
* Versão: 1.0
****************************************************************************************************************************************************/

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Inserir um novo ator para um filme
const insertFilmeAtor = async (dadosFilmeAtor) => {

    try {
        let sql = `insert into tbl_filme_ator (id_filme, id_ator) values (${dadosFilmeAtor.id_filme}, ${dadosFilmeAtor.id_ator})`
        let resultStatus = await prisma.$executeRawUnsafe(sql)
        if(resultStatus)
            return true
        else
            return false
    } catch (error) {
        return false
    }

}

// Atualizar um ator de um filme existente filtrando pelo ID
const updateFilmeAtor = async (dadosFilmeAtor, idFilmeAtor) => {

    try {
        let sql = `update tbl_filme_ator set id_filme = ${dadosFilmeAtor.id_filme}, id_ator = ${dadosFilmeAtor.id_ator} where id = ${idFilmeAtor}`   
        let resultStatus = await prisma.$executeRawUnsafe(sql)
        if(resultStatus)
            return true
        else
            return false
    } catch (error) {
        return false
    }

}

// Deletar um ator existente de um filme filtrando pelo ID
const deleteFilmeAtor = async (id) => {

    try {
        let sql = `delete from tbl_filme_ator where id = ${id}`
        let rsFilmeAtor = await prisma.$executeRawUnsafe(sql)
        return rsFilmeAtor
    } catch (error) {
        return false
    }

}

// Listar todas as relações de filmes e atores existentes na tabela
const selectAllFilmesAtores = async () => {   

    try {
        let sql = 'select tfa.id, tfa.id_filme, tf.nome as filme, tfa.id_ator, ta.nome as ator from tbl_filme_ator as tfa inner join tbl_filme as tf on tfa.id_filme=tf.id inner join tbl_ator as ta on tfa.id_ator=ta.id order by tfa.id desc'
        let rsFilmeAtor = await prisma.$queryRawUnsafe(sql)
        return rsFilmeAtor
    } catch (error) {
        return false
    }

}

// Buscar uma relação de filme e ator existente filtrando pelo ID
const selectByIdFilmeAtor = async (id) => {

    try {
        let sql = `select tfa.id, tfa.id_filme, tf.nome as filme, tfa.id_ator, ta.nome as ator from tbl_filme_ator as tfa inner join tbl_filme as tf on tfa.id_filme=tf.id inner join tbl_ator as ta on tfa.id_ator=ta.id where tfa.id = ${id}`
        let rsFilmeAtor = await prisma.$queryRawUnsafe(sql)
        return rsFilmeAtor
    } catch (error) {
        return false
    }

}

// Buscar o id do último item da tabela
const selectLastId = async () => {
   
    try {
        let sql = 'select cast(last_insert_id() as DECIMAL) as id from tbl_filme_ator limit 1'
        let rsFilmeAtor = await prisma.$queryRawUnsafe(sql)
        return rsFilmeAtor
    } catch (error) {
        return false
    }

}

module.exports = {
    insertFilmeAtor,
    updateFilmeAtor,
    deleteFilmeAtor,
    selectAllFilmesAtores,
    selectByIdFilmeAtor,
    selectLastId
}