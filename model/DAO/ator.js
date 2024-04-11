/****************************************************************************************************************************************************
* Objetivo: Criar a interação com o Banco de Dados MySQL para fazer CRUD de atores
* Data: 09/04/2024
* Autor: Ryan Alves
* Versão: 1.0
****************************************************************************************************************************************************/

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Inserir um novo ator
const insertAtor = async (dadosAtor) => {

    try {

        let sql
        
        if(dadosAtor.data_falecimento == null || dadosAtor.data_falecimento == '' || dadosAtor.data_falecimento == undefined){
            sql = `insert into tbl_ator (nome, foto, biografia, data_nascimento, data_falecimento) values ('${dadosAtor.nome}', '${dadosAtor.foto}', '${dadosAtor.biografia}', '${dadosAtor.data_nascimento}', null)`
        }else{
            sql = `insert into tbl_ator (nome, foto, biografia, data_nascimento, data_falecimento) values ('${dadosAtor.nome}', '${dadosAtor.foto}', '${dadosAtor.biografia}', '${dadosAtor.data_nascimento}', '${dadosAtor.data_falecimento}')`
        }

        let resultStatus = await prisma.$executeRawUnsafe(sql)
        if(resultStatus)
            return true
        else
            return false

    } catch (error) {
        return false
    }

}

// Atualizar um ator existente filtrando pelo ID
const updateAtor = async (dadosAtor, idAtor) => {

    try {

        let sql

        if(dadosAtor.data_falecimento == null || dadosAtor.data_falecimento == '' || dadosAtor.data_falecimento == undefined){
            sql = `update tbl_ator set nome = '${dadosAtor.nome}', foto = '${dadosAtor.foto}', biografia = '${dadosAtor.biografia}', data_nascimento = '${dadosAtor.data_nascimento}', data_falecimento = null where id = ${idAtor}`   
        }else{
            sql = `update tbl_ator set nome = '${dadosAtor.nome}', foto = '${dadosAtor.foto}', biografia = '${dadosAtor.biografia}', data_nascimento = '${dadosAtor.data_nascimento}', data_falecimento = '${dadosAtor.data_falecimento}' where id = ${idAtor}`   
        }

        let resultStatus = await prisma.$executeRawUnsafe(sql)
        if(resultStatus)
            return true
        else
            return false

    } catch (error) {
        return false
    }

}

// Deletar um ator existente filtrando pelo ID
const deleteAtor = async (id) => {

    try {
        let sql = `delete from tbl_ator where id = ${id}`
        let rsAtor = await prisma.$executeRawUnsafe(sql)
        return rsAtor
    } catch (error) {
        return false
    }

}

// Listar todos os atores existentes na tabela
const selectAllAtores = async () => {   

    try {
        let sql = `select id, nome, foto, biografia, date_format(data_nascimento, '%d-%m-%Y') as data_nascimento, date_format(data_falecimento, '%d-%m-%Y') as data_falecimento from tbl_ator order by id desc`
        let rsAtor = await prisma.$queryRawUnsafe(sql)
        return rsAtor
    } catch (error) {
        return false
    }

}

// Buscar um ator existente filtrando pelo ID
const selectByIdAtor = async (id) => {

    try {
        let sql = `select id, nome, foto, biografia, date_format(data_nascimento, '%d-%m-%Y') as data_nascimento, date_format(data_falecimento, '%d-%m-%Y') as data_falecimento from tbl_ator where id = ${id}`
        let rsAtor = await prisma.$queryRawUnsafe(sql)
        return rsAtor
    } catch (error) {
        return false
    }

}

// Buscar o id do último item da tabela
const selectLastId = async () => {
   
    try {
        let sql = 'select cast(last_insert_id() as DECIMAL) as id from tbl_ator limit 1'
        let rsAtor = await prisma.$queryRawUnsafe(sql)
        return rsAtor
    } catch (error) {
        return false
    }

}

module.exports = {
    insertAtor,
    updateAtor,
    deleteAtor,
    selectAllAtores,
    selectByIdAtor,
    selectLastId
}