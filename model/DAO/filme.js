/****************************************************************************************************************************************************
* Objetivo: Criar a interação com o Banco de Dados MySQL para fazer CRUD de filmes
* Data: 30/01/2024
* Autor: Ryan Alves
* Versão: 1.0
****************************************************************************************************************************************************/

// Import da Biblioteca do Prisma Client
const { PrismaClient } = require ('@prisma/client')

// Instanciando o objeto prisma com as características do Prisma Cliente
const prisma = new PrismaClient()

// Inserir um novo filme
const insertFilme = async() => {}

// Atualizar um filme existente filtrando pelo ID
const updateFilme = async(id) => {}

// Deletar um filme existente filtrando pelo ID
const deleteFilme = async(id) => {}

// Listar todos os filmes existentes na tabela
const selectAllFilmes = async() => {

    // Script sql para listar todos os registros
    let sql = 'select * from tbl_filme'

        // $queryRawUnsafe(sql) -- Encaminha apenas a variável
        // $queryRaw('select * from table tbl_filmes') -- Encaminha o script

    // Executa o script sql no banco de dados e recebe o retorno na variável rsFilmes
    let rsFilmes = await prisma.$queryRawUnsafe(sql)

    // Tratamento de erros para retornar os dados ou retornar false

    if (rsFilmes.length > 0)
        return rsFilmes
    else
        return false

}

// Buscar um filme existente filtrando pelo ID
const selectByIdFilme = async(id) => {}

const selectByName = async(nome) => {

    // Script sql para listar todos os registros
    let sql = `select * from tbl_filme where tbl_filme.nome like '%${nome}%'`

        // $queryRawUnsafe(sql) -- Encaminha apenas a variável
        // $queryRaw('select * from table tbl_filmes') -- Encaminha o script

    // Executa o script sql no banco de dados e recebe o retorno na variável rsFilmes
    let rsFilmes = await prisma.$queryRawUnsafe(sql)

    // Tratamento de erros para retornar os dados ou retornar false

    if (rsFilmes.length > 0)
        return rsFilmes
    else
        return false

}

module.exports = {
    insertFilme,
    updateFilme,
    deleteFilme,
    selectAllFilmes,
    selectByIdFilme,
    selectByName
}