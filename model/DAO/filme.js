/****************************************************************************************************************************************************
* Objetivo: Criar a interação com o Banco de Dados MySQL para fazer CRUD de filmes
* Data: 30/01/2024
* Autor: Ryan Alves
* Versão: 1.0
****************************************************************************************************************************************************/

// Import da Biblioteca do Prisma Client
const { PrismaClient } = require('@prisma/client')

// Instanciando o objeto prisma com as características do Prisma Cliente
const prisma = new PrismaClient()

// Inserir um novo filme
const insertFilme = async (dadosFilme) => {

    
    try {

        let sql

        if(dadosFilme.data_relancamento == null || dadosFilme.data_relancamento == '' || dadosFilme.data_relancamento == undefined){    
            
            sql = `insert into tbl_filme(
                                            nome,
                                            sinopse,
                                            duracao,
                                            data_lancamento,
                                            data_relancamento,
                                            foto_capa,
                                            valor_unitario
                                        ) values (
                                            '${dadosFilme.nome}',
                                            '${dadosFilme.sinopse}',
                                            '${dadosFilme.duracao}',
                                            '${dadosFilme.data_lancamento}',
                                            null,
                                            '${dadosFilme.foto_capa}',
                                            ${dadosFilme.valor_unitario}
                                        )`
            
        } else {

            sql = `insert into tbl_filme(
                                            nome,
                                            sinopse,
                                            duracao,
                                            data_lancamento,
                                            data_relancamento,
                                            foto_capa,
                                            valor_unitario
                                        ) values (
                                            '${dadosFilme.nome}',
                                            '${dadosFilme.sinopse}',
                                            '${dadosFilme.duracao}',
                                            '${dadosFilme.data_lancamento}',
                                            '${dadosFilme.data_relancamento}',
                                            '${dadosFilme.foto_capa}',
                                            ${dadosFilme.valor_unitario}
                                        )`

        }

        // Executa o sciptSQL no DB (devemos usar o comando execute e não o query)
        // O comando execute deve ser utilizado para INSERT, UPDATE, DELETE
        let resultStatus = await prisma.$executeRawUnsafe(sql)
        
        // Validação para verificar se o insert funcionou no DB
        if(resultStatus)
            return true
        else
            return false

    } catch (error) {
        
        return false

    }



}

// Atualizar um filme existente filtrando pelo ID
const updateFilme = async (id) => { }

// Deletar um filme existente filtrando pelo ID
const deleteFilme = async (id) => { }

// Listar todos os filmes existentes na tabela
const selectAllFilmes = async () => {

    try {

        // Script sql para listar todos os registros
        let sql = 'select * from tbl_filme'

        // $queryRawUnsafe(sql) -- Encaminha apenas a variável
        // $queryRaw('select * from table tbl_filmes') -- Encaminha o script

        // Executa o script sql no banco de dados e recebe o retorno na variável rsFilmes
        let rsFilmes = await prisma.$queryRawUnsafe(sql)

        // Tratamento de erros para retornar os dados ou retornar false
        return rsFilmes
        
    } catch (error) {
  
        return false

    }

}

// Buscar um filme existente filtrando pelo ID
const selectByIdFilme = async (id) => {

    try {

        // Realiza a busca do Filme pelo ID
        let sql = `select * from tbl_filme where id = ${id}`

        // Executa no Banco de Dado o script SQL
        let rsFilmes = await prisma.$queryRawUnsafe(sql)

        return rsFilmes


    } catch (error) {

        return false

    }

}

const selectByName = async (nome) => {

    try {

        // Script sql para listar todos os registros
        let sql = `select * from tbl_filme where tbl_filme.nome like '%${nome}%'`

        // $queryRawUnsafe(sql) -- Encaminha apenas a variável
        // $queryRaw('select * from table tbl_filmes') -- Encaminha o script

        // Executa o script sql no banco de dados e recebe o retorno na variável rsFilmes
        let rsFilmes = await prisma.$queryRawUnsafe(sql)

        return rsFilmes
        

    } catch (error) {

        return false

    }

}

module.exports = {
    insertFilme,
    updateFilme,
    deleteFilme,
    selectAllFilmes,
    selectByIdFilme,
    selectByName
}