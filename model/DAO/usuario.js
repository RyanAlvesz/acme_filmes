/****************************************************************************************************************************************************
* Objetivo: Criar a interação com o Banco de Dados MySQL para fazer CRUD de usuários
* Data: 09/04/2024
* Autor: Ryan Alves
* Versão: 1.0
****************************************************************************************************************************************************/

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Inserir um novo usuário
const insertUsuario = async (dadosUsuario) => {

    try {
        let sql = `insert into tbl_usuario (nome,email,senha) values ('${dadosUsuario.nome}', '${dadosUsuario.email}', md5('${dadosUsuario.senha}'))`
        let resultStatus = await prisma.$executeRawUnsafe(sql)
        if(resultStatus)
            return true
        else
            return false
    } catch (error) {
        return false
    }

}

// Atualizar um usuário existente filtrando pelo ID
const updateUsuario = async (dadosUsuario, idUsuario) => {

    try {
        let sql = `update tbl_usuario set nome = '${dadosUsuario.nome}', email = '${dadosUsuario.email}' where id = ${idUsuario}`           
        let resultStatus = await prisma.$executeRawUnsafe(sql)
        if(resultStatus)
            return true
        else
            return false
    } catch (error) {
        return false
    }

}

// Atualizar um usuário existente filtrando pelo ID
const updateUsuarioSenha = async (dadosUsuario, idUsuario) => {

    try {
        let sql = `update tbl_usuario set nome = '${dadosUsuario.nome}', email = '${dadosUsuario.email}', senha = md5('${dadosUsuario.senha}') where id = ${idUsuario}`   
        let resultStatus = await prisma.$executeRawUnsafe(sql)
        if(resultStatus)
            return true
        else
            return false
    } catch (error) {
        return false
    }

}

// Deletar um usuário existente filtrando pelo ID
const deleteUsuario = async (id) => {

    try {
        let sql = `delete from tbl_usuario where id = ${id}`
        let rsUsuario = await prisma.$executeRawUnsafe(sql)
        return rsUsuario
    } catch (error) {
        return false
    }

}

// Listar todos os usuários existentes na tabela
const selectAllUsuarios = async () => {   

    try {
        let sql = 'select nome, email from tbl_usuario order by id desc'
        let rsUsuario = await prisma.$queryRawUnsafe(sql)
        return rsUsuario
    } catch (error) {
        return false
    }

}

// Buscar um usuário existente filtrando pelo ID
const selectByIdUsuario = async (id) => {

    try {
        let sql = `select nome, email from tbl_usuario where id = ${id}`
        let rsUsuario = await prisma.$queryRawUnsafe(sql)
        return rsUsuario
    } catch (error) {
        return false
    }

}

// Validação de usuário 
const selectValidacaoUsuario = async (email, senha) => {

    try {
        let sql = `select tu.id, tu.nome, tu.email from tbl_usuario as tu where email = '${email}' and senha = md5('${senha}')`
        let rsUsuario = await prisma.$queryRawUnsafe(sql)
        return rsUsuario        
    } catch (error) {
        return false
    }

}

// Buscar o id do último item da tabela
const selectLastId = async () => {
   
    try {
        let sql = 'select cast(last_insert_id() as DECIMAL) as id from tbl_usuario limit 1'
        let rsUsuario = await prisma.$queryRawUnsafe(sql)
        return rsUsuario
    } catch (error) {
        return false
    }

}

module.exports = {
    insertUsuario,
    updateUsuario,
    updateUsuarioSenha,
    deleteUsuario,
    selectAllUsuarios,
    selectByIdUsuario,
    selectValidacaoUsuario,
    selectLastId
}