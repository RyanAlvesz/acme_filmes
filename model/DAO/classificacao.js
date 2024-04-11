/****************************************************************************************************************************************************
* Objetivo: Criar a interação com o Banco de Dados MySQL para fazer CRUD de classificação
* Data: 09/04/2024
* Autor: Ryan Alves
* Versão: 1.0
****************************************************************************************************************************************************/

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Inserir uma nova classificação
const insertClassificacao = async (dadosClassificacao) => {

    try {
        let sql = `insert into tbl_classificacao (sigla, descricao, classificacao_indicativa, icone) values ('${dadosClassificacao.sigla}', '${dadosClassificacao.descricao}', '${dadosClassificacao.classificacao_indicativa}', '${dadosClassificacao.icone}')`
        let resultStatus = await prisma.$executeRawUnsafe(sql)
        if(resultStatus)
            return true
        else
            return false
    } catch (error) {
        return false
    }

}

// Atualizar uma classificacao existente filtrando pelo ID
const updateClassificacao = async (dadosClassificacao, idClassificacao) => {

    try {
        let sql = `update tbl_classificacao set sigla = '${dadosClassificacao.sigla}', descricao = '${dadosClassificacao.descricao}', classificacao_indicativa = '${dadosClassificacao.classificacao_indicativa}', icone = '${dadosClassificacao.icone}' where id = ${idClassificacao}`   
        let resultStatus = await prisma.$executeRawUnsafe(sql)
        if(resultStatus)
            return true
        else
            return false
    } catch (error) {
        return false
    }

}

// Deletar uma classificacao existente filtrando pelo ID
const deleteClassificacao = async (id) => {

    try {
        let sql = `delete from tbl_classificacao where id = ${id}`
        let rsClassificacao = await prisma.$executeRawUnsafe(sql)
        return rsClassificacao
    } catch (error) {
        return false
    }

}

// Listar todas as classificacoes existentes na tabela
const selectAllClassificacoes = async () => {   

    try {
        let sql = 'select * from tbl_classificacao order by id desc'
        let rsClassificacao = await prisma.$queryRawUnsafe(sql)
        return rsClassificacao
    } catch (error) {
        return false
    }

}

// Buscar uma classificacao existente filtrando pelo ID
const selectByIdClassificacao = async (id) => {

    try {
        let sql = `select * from tbl_classificacao where id = ${id}`
        let rsClassificacao = await prisma.$queryRawUnsafe(sql)
        return rsClassificacao
    } catch (error) {
        return false
    }

}

// Buscar o id do último item da tabela
const selectLastId = async () => {
   
    try {
        let sql = 'select cast(last_insert_id() as DECIMAL) as id from tbl_classificacao limit 1'
        let rsClassificacao = await prisma.$queryRawUnsafe(sql)
        return rsClassificacao
    } catch (error) {
        return false
    }

}

module.exports = {
    insertClassificacao,
    updateClassificacao,
    deleteClassificacao,
    selectAllClassificacoes,
    selectByIdClassificacao,
    selectLastId
}