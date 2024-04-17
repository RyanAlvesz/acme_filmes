/****************************************************************************************************************************************************
* Objetivo: Criar a interação com o Banco de Dados MySQL para fazer CRUD de funcionários
* Data: 09/04/2024
* Autor: Ryan Alves
* Versão: 1.0
****************************************************************************************************************************************************/

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Inserir um novo funcionário
const insertFuncionario = async (dadosFuncionario) => {

    try {
        let sql = `insert into tbl_funcionario (nome,email,senha) values ('${dadosFuncionario.nome}', '${dadosFuncionario.email}', md5('${dadosFuncionario.senha}'))`
        let resultStatus = await prisma.$executeRawUnsafe(sql)
        if(resultStatus)
            return true
        else
            return false
    } catch (error) {
        return false
    }

}

// Atualizar um funcionário existente filtrando pelo ID
const updateFuncionario = async (dadosFuncionario, idFuncionario) => {

    try {
        let sql = `update tbl_funcionario set nome = '${dadosFuncionario.nome}', email = '${dadosFuncionario.email}', senha = md5('${dadosFuncionario.senha}') where id = ${idFuncionario}`   
        let resultStatus = await prisma.$executeRawUnsafe(sql)
        if(resultStatus)
            return true
        else
            return false
    } catch (error) {
        return false
    }

}

// Deletar um funcionário existente filtrando pelo ID
const deleteFuncionario = async (id) => {

    try {
        let sql = `delete from tbl_funcionario where id = ${id}`
        let rsFuncionario = await prisma.$executeRawUnsafe(sql)
        return rsFuncionario
    } catch (error) {
        return false
    }

}

// Listar todos os funcionários existentes na tabela
const selectAllFuncionarios = async () => {   

    try {
        let sql = 'select * from tbl_funcionario order by id desc'
        let rsFuncionario = await prisma.$queryRawUnsafe(sql)
        return rsFuncionario
    } catch (error) {
        return false
    }

}

// Buscar um funcionário existente filtrando pelo ID
const selectByIdFuncionario = async (id) => {

    try {
        let sql = `select * from tbl_funcionario where id = ${id}`
        let rsFuncionario = await prisma.$queryRawUnsafe(sql)
        return rsFuncionario
    } catch (error) {
        return false
    }

}

// Validação de funcionário 
const selectValidacaoFuncionario = async (email, senha) => {

    try {
        let sql = `select tf.id, tf.nome, tf.email from tbl_funcionario as tf where email = '${email}' and senha = md5('${senha}')`
        let rsFuncionario = await prisma.$queryRawUnsafe(sql)
        return rsFuncionario        
    } catch (error) {
        return false
    }

}

// Buscar o id do último item da tabela
const selectLastId = async () => {
   
    try {
        let sql = 'select cast(last_insert_id() as DECIMAL) as id from tbl_funcionario limit 1'
        let rsFuncionario = await prisma.$queryRawUnsafe(sql)
        return rsFuncionario
    } catch (error) {
        return false
    }

}

module.exports = {
    insertFuncionario,
    updateFuncionario,
    deleteFuncionario,
    selectAllFuncionarios,
    selectByIdFuncionario,
    selectValidacaoFuncionario,
    selectLastId
}