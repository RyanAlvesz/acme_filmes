/****************************************************************************************************************************************************
* Objetivo: Criar a interação com o Banco de Dados MySQL para fazer CRUD de categoria de foto de perfil
* Data: 09/04/2024
* Autor: Ryan Alves
* Versão: 1.0
****************************************************************************************************************************************************/

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Inserir uma nova categoria de foto de perfil
const insertCategoriaFotoPerfil = async (dadosCategoriaFotoPerfil) => {

    try {
        let sql = `insert into tbl_categoria_foto_perfil (nome) values ('${dadosCategoriaFotoPerfil.nome}')`
        let resultStatus = await prisma.$executeRawUnsafe(sql)
        if(resultStatus)
            return true
        else
            return false
    } catch (error) {
        return false
    }

}

// Atualizar uma categoria de foto de perfil existente filtrando pelo ID
const updateCategoriaFotoPerfil = async (dadosCategoriaFotoPerfil, idCategoriaFotoPerfil) => {

    try {
        let sql = `update tbl_categoria_foto_perfil set nome = '${dadosCategoriaFotoPerfil.nome}' where id = ${idCategoriaFotoPerfil}`   
        let resultStatus = await prisma.$executeRawUnsafe(sql)
        if(resultStatus)
            return true
        else
            return false
    } catch (error) {
        return false
    }

}

// Deletar uma categoria de foto de perfil existente filtrando pelo ID
const deleteCategoriaFotoPerfil = async (id) => {

    try {
        let sql = `delete from tbl_categoria_foto_perfil where id = ${id}`
        let rsCategoriaFotoPerfil = await prisma.$executeRawUnsafe(sql)
        return rsCategoriaFotoPerfil
    } catch (error) {
        return false
    }

}

// Listar todas as categorias de fotos de perfil existentes na tabela
const selectAllCategoriaFotoPeril = async () => {   

    try {
        let sql = 'select * from tbl_categoria_foto_perfil order by id desc'
        let rsCategoriaFotoPerfil = await prisma.$queryRawUnsafe(sql)
        return rsCategoriaFotoPerfil
    } catch (error) {
        return false
    }

}

// Buscar uma categoria de foto de perfil existente filtrando pelo ID
const selectByIdCategoriaFotoPerfil = async (id) => {

    try {
        let sql = `select * from tbl_categoria_foto_perfil where id = ${id}`
        let rsCategoriaFotoPerfil = await prisma.$queryRawUnsafe(sql)
        return rsCategoriaFotoPerfil
    } catch (error) {
        return false
    }

}

// Buscar o id do último item da tabela
const selectLastId = async () => {
   
    try {
        let sql = 'select cast(last_insert_id() as DECIMAL) as id from tbl_categoria_foto_perfil limit 1'
        let rsCategoriaFotoPerfil = await prisma.$queryRawUnsafe(sql)
        return rsCategoriaFotoPerfil
    } catch (error) {
        return false
    }

}

module.exports = {
    insertCategoriaFotoPerfil,
    updateCategoriaFotoPerfil,
    deleteCategoriaFotoPerfil,
    selectAllCategoriaFotoPeril,
    selectByIdCategoriaFotoPerfil,
    selectLastId
}