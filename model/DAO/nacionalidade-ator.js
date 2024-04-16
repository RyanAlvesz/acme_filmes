/****************************************************************************************************************************************************
* Objetivo: Criar a interação com o Banco de Dados MySQL para fazer CRUD de nacionalidade de ator
* Data: 09/04/2024
* Autor: Ryan Alves
* Versão: 1.0
****************************************************************************************************************************************************/

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Inserir uma nova nacionalidade para um ator
const insertNacionalidadeAtor = async (dadosNacionalidadeAtor) => {

    try {
        let sql = `insert into tbl_nacionalidade_ator (id_nacionalidade, id_ator) values (${dadosNacionalidadeAtor.id_nacionalidade}, ${dadosNacionalidadeAtor.id_ator})`
        let resultStatus = await prisma.$executeRawUnsafe(sql)
        if(resultStatus)
            return true
        else
            return false
    } catch (error) {
        return false
    }

}

// Atualizar uma nacionalidade de um ator existente filtrando pelo ID
const updateNacionalidadeAtor = async (dadosNacionalidadeAtor, idNacionalidadeAtor) => {

    try {
        let sql = `update tbl_nacionalidade_ator set id_nacionalidade = ${dadosNacionalidadeAtor.id_nacionalidade}, id_ator = ${dadosNacionalidadeAtor.id_ator} where id = ${idNacionalidadeAtor}`   
        let resultStatus = await prisma.$executeRawUnsafe(sql)
        if(resultStatus)
            return true
        else
            return false
    } catch (error) {
        return false
    }

}

// Deletar uma nacionalidade existente de um ator filtrando pelo ID
const deleteNacionalidadeAtor = async (id) => {

    try {
        let sql = `delete from tbl_nacionalidade_ator where id = ${id}`
        let rsNacionalidadeAtor = await prisma.$executeRawUnsafe(sql)
        return rsNacionalidadeAtor
    } catch (error) {
        return false
    }

}

// Listar todas as relações de nacionalidades e atores existentes na tabela
const selectAllNacionalidadesAtores = async () => {   

    try {
        let sql = 'select tna.id, tna.id_ator, ta.nome as ator, tna.id_nacionalidade, tn.nome as nacionalidade from tbl_nacionalidade_ator as tna inner join tbl_nacionalidade as tn on tna.id_nacionalidade=tn.id inner join tbl_ator as ta on tna.id_ator=ta.id order by tna.id desc'
        let rsNacionalidadeAtor = await prisma.$queryRawUnsafe(sql)
        return rsNacionalidadeAtor
    } catch (error) {
        return false
    }

}

// Buscar uma relação de nacionalidade e ator existente filtrando pelo ID
const selectByIdNacionalidadeAtor = async (id) => {

    try {
        let sql = `select tna.id, tna.id_ator, ta.nome as ator, tna.id_nacionalidade, tn.nome as nacionalidade from tbl_nacionalidade_ator as tna inner join tbl_nacionalidade as tn on tna.id_nacionalidade=tn.id inner join tbl_ator as ta on tna.id_ator=ta.id where tna.id = ${id}`
        let rsNacionalidadeAtor = await prisma.$queryRawUnsafe(sql)
        return rsNacionalidadeAtor
    } catch (error) {
        return false
    }

}

// Buscar as nacionalidades de um ator existente filtrando pelo ID
const selectAllNacionalidadesByIdAtor = async (id) => {

    try {
        let sql = `select tn.id, tn.nome as gentilico, tn.pais from tbl_nacionalidade_ator as tna inner join tbl_nacionalidade as tn on tna.id_nacionalidade=tn.id where tna.id_ator = ${id}`
        let rsNacionalidadeAtor = await prisma.$queryRawUnsafe(sql)
        return rsNacionalidadeAtor
    } catch (error) {
        return false
    }

}

// Buscar o id do último item da tabela
const selectLastId = async () => {
   
    try {
        let sql = 'select cast(last_insert_id() as DECIMAL) as id from tbl_nacionalidade_ator limit 1'
        let rsNacionalidadeAtor = await prisma.$queryRawUnsafe(sql)
        return rsNacionalidadeAtor
    } catch (error) {
        return false
    }

}

module.exports = {
    insertNacionalidadeAtor,
    updateNacionalidadeAtor,
    deleteNacionalidadeAtor,
    selectAllNacionalidadesAtores,
    selectAllNacionalidadesByIdAtor,
    selectByIdNacionalidadeAtor,
    selectLastId
}