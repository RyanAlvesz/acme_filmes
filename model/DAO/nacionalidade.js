/****************************************************************************************************************************************************
* Objetivo: Criar a interação com o Banco de Dados MySQL para fazer CRUD de nacionalidade
* Data: 09/04/2024
* Autor: Ryan Alves
* Versão: 1.0
****************************************************************************************************************************************************/

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Inserir uma nova nacionalidade
const insertNacionalidade = async (dadosNacionalidade) => {

    try {
        let sql = `insert into tbl_nacionalidade (pais, nome, bandeira) values ('${dadosNacionalidade.pais}', '${dadosNacionalidade.nome}', '${dadosNacionalidade.bandeira}')`
        let resultStatus = await prisma.$executeRawUnsafe(sql)
        if(resultStatus)
            return true
        else
            return false
    } catch (error) {
        return false
    }

}

// Atualizar uma nacionalidade existente filtrando pelo ID
const updateNacionalidade = async (dadosNacionalidade, idNacionalidade) => {

    try {
        let sql = `update tbl_nacionalidade set pais = '${dadosNacionalidade.pais}', nome = '${dadosNacionalidade.nome}', bandeira = '${dadosNacionalidade.bandeira}' where id = ${idNacionalidade}`   
        let resultStatus = await prisma.$executeRawUnsafe(sql)
        if(resultStatus)
            return true
        else
            return false
    } catch (error) {
        return false
    }

}

// Deletar uma nacionalidade existente filtrando pelo ID
const deleteNacionalidade = async (id) => {

    try {
        let sql = `delete from tbl_nacionalidade where id = ${id}`
        let rsNacionalidade = await prisma.$executeRawUnsafe(sql)
        return rsNacionalidade
    } catch (error) {
        return false
    }

}

// Listar todas as nacionalidades existentes na tabela
const selectAllNacionalidades = async () => {   

    try {
        let sql = 'select id, pais, nome as gentilico, bandeira from tbl_nacionalidade order by id desc'
        let rsNacionalidade = await prisma.$queryRawUnsafe(sql)
        return rsNacionalidade
    } catch (error) {
        return false
    }

}

// Buscar uma nacionalidade existente filtrando pelo ID
const selectByIdNacionalidade = async (id) => {

    try {
        let sql = `select id, pais, nome as gentilico, bandeira from tbl_nacionalidade where id = ${id}`
        let rsNacionalidade = await prisma.$queryRawUnsafe(sql)
        return rsNacionalidade
    } catch (error) {
        return false
    }

}

// Buscar o id do último item da tabela
const selectLastId = async () => {
   
    try {
        let sql = 'select cast(last_insert_id() as DECIMAL) as id from tbl_nacionalidade limit 1'
        let rsNacionalidade = await prisma.$queryRawUnsafe(sql)
        return rsNacionalidade
    } catch (error) {
        return false
    }

}

module.exports = {
    insertNacionalidade,
    updateNacionalidade,
    deleteNacionalidade,
    selectAllNacionalidades,
    selectByIdNacionalidade,
    selectLastId
}