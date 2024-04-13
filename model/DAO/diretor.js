/****************************************************************************************************************************************************
* Objetivo: Criar a interação com o Banco de Dados MySQL para fazer CRUD de diretores
* Data: 09/04/2024
* Autor: Ryan Alves
* Versão: 1.0
****************************************************************************************************************************************************/

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Inserir um novo diretor
const insertDiretor = async (dadosDiretor) => {

    try {
        let sql = `insert into tbl_diretor (nome) values ('${dadosDiretor.nome}')`
        let resultStatus = await prisma.$executeRawUnsafe(sql)
        if(resultStatus)
            return true
        else
            return false
    } catch (error) {
        return false
    }

}

// Atualizar um diretor existente filtrando pelo ID
const updateDiretor = async (dadosDiretor, idDiretor) => {

    try {
        let sql = `update tbl_diretor set nome = '${dadosDiretor.nome}' where id = ${idDiretor}`   
        let resultStatus = await prisma.$executeRawUnsafe(sql)
        if(resultStatus)
            return true
        else
            return false
    } catch (error) {
        return false
    }

}

// Deletar um diretor existente filtrando pelo ID
const deleteDiretor = async (id) => {

    try {
        let sql = `delete from tbl_diretor where id = ${id}`
        let rsDiretor = await prisma.$executeRawUnsafe(sql)
        return rsDiretor
    } catch (error) {
        return false
    }

}

// Listar todos os diretor existentes na tabela
const selectAllDiretores = async () => {   

    try {
        let sql = 'select * from tbl_diretor order by id desc'
        let rsDiretor = await prisma.$queryRawUnsafe(sql)
        return rsDiretor
    } catch (error) {
        return false
    }

}

// Buscar um diretor existente filtrando pelo ID
const selectByIdDiretor = async (id) => {

    try {
        let sql = `select * from tbl_diretor where id = ${id}`
        let rsDiretor = await prisma.$queryRawUnsafe(sql)
        return rsDiretor
    } catch (error) {
        return false
    }

}

// Buscar os diretores de um filme filtrando pelo ID
const selectAllDiretoresByFilme = async (id) => {

    try {
        let sql = `select td.id, td.nome from tbl_diretor as td inner join tbl_filme_diretor as tfd on td.id=tfd.id_diretor where tfd.id_filme = ${id}`
        let rsDiretor = await prisma.$queryRawUnsafe(sql)
        return rsDiretor
    } catch (error) {
        return false
    }

}

// Buscar o id do último item da tabela
const selectLastId = async () => {
   
    try {
        let sql = 'select cast(last_insert_id() as DECIMAL) as id from tbl_diretor limit 1'
        let rsDiretor = await prisma.$queryRawUnsafe(sql)
        return rsDiretor
    } catch (error) {
        return false
    }

}

module.exports = {
    insertDiretor,
    updateDiretor,
    deleteDiretor,
    selectAllDiretores,
    selectAllDiretoresByFilme,
    selectByIdDiretor,
    selectLastId
}