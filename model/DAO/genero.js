/****************************************************************************************************************************************************
* Objetivo: Criar a interação com o Banco de Dados MySQL para fazer CRUD de gêneros
* Data: 09/04/2024
* Autor: Ryan Alves
* Versão: 1.0
****************************************************************************************************************************************************/

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Inserir um novo gênero
const insertGenero = async (dadosGenero) => {

    try {
        let sql = `insert into tbl_genero (nome) values ('${dadosGenero.nome}')`
        let resultStatus = await prisma.$executeRawUnsafe(sql)
        if(resultStatus)
            return true
        else
            return false
    } catch (error) {
        return false
    }

}

// Atualizar um gênero existente filtrando pelo ID
const updateGenero = async (dadosGenero, idGenero) => {

    try {
        let sql = `update tbl_genero set nome = '${dadosGenero.nome}' where id = ${idGenero}`   
        let resultStatus = await prisma.$executeRawUnsafe(sql)
        if(resultStatus)
            return true
        else
            return false
    } catch (error) {
        return false
    }

}

// Deletar um gênero existente filtrando pelo ID
const deleteGenero = async (id) => {

    try {
        let sql = `delete from tbl_genero where id = ${id}`
        let rsGenero = await prisma.$executeRawUnsafe(sql)
        return rsGenero
    } catch (error) {
        return false
    }

}

// Listar todos os gêneros existentes na tabela
const selectAllGeneros = async () => {   

    try {
        let sql = 'select * from tbl_genero order by id desc'
        let rsGenero = await prisma.$queryRawUnsafe(sql)
        return rsGenero
    } catch (error) {
        return false
    }

}

// Buscar um gênero existente filtrando pelo ID
const selectByIdGenero = async (id) => {

    try {
        let sql = `select * from tbl_genero where id = ${id}`
        let rsGenero = await prisma.$queryRawUnsafe(sql)
        return rsGenero
    } catch (error) {
        return false
    }

}

// Buscar os gêneros de um filme filtrando pelo ID
const selectAllGenerosByFilme = async (id) => {

    try {
        let sql = `select tg.id, tg.nome from tbl_genero as tg inner join tbl_filme_genero as tfg on tg.id=tfg.id_genero where tfg.id_filme = ${id}`
        let rsGenero = await prisma.$queryRawUnsafe(sql)
        return rsGenero
    } catch (error) {
        return false
    }

}

// Buscar o id do último item da tabela
const selectLastId = async () => {
   
    try {
        let sql = 'select cast(last_insert_id() as DECIMAL) as id from tbl_genero limit 1'
        let rsGenero = await prisma.$queryRawUnsafe(sql)
        return rsGenero
    } catch (error) {
        return false
    }

}

module.exports = {
    insertGenero,
    updateGenero,
    deleteGenero,
    selectAllGeneros,
    selectAllGenerosByFilme,
    selectByIdGenero,
    selectLastId
}