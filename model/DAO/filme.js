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

        let sql = `insert into tbl_filme(nome, sinopse, duracao, data_lancamento, foto_capa, foto_banner, destaque, link_trailer, id_classificacao) values ('${dadosFilme.nome}','${dadosFilme.sinopse}','${dadosFilme.duracao}','${dadosFilme.data_lancamento}','${dadosFilme.foto_capa}','${dadosFilme.foto_banner}', ${dadosFilme.destaque}, '${dadosFilme.link_trailer}', ${dadosFilme.id_classificacao})`

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
const updateFilme = async (dadosFilme, idFilme) => {

    try {

        let sql = `update tbl_filme set nome = '${dadosFilme.nome}', sinopse = '${dadosFilme.sinopse}', duracao = '${dadosFilme.duracao}', data_lancamento = '${dadosFilme.data_lancamento}', foto_capa = '${dadosFilme.foto_capa}', foto_capa = '${dadosFilme.foto_capa}',foto_banner = '${dadosFilme.foto_banner}', destaque = ${dadosFilme.destaque}, link_trailer = '${dadosFilme.link_trailer}', id_classificacao = ${dadosFilme.id_classificacao} where id = ${idFilme}`
                   

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

// Adicionar um filme em destaque
const updateAdicionarDestaque = async (idFilme) => {

    try {

        let sql = `update tbl_filme set destaque = true where id = ${idFilme}`
        let resultStatus = await prisma.$executeRawUnsafe(sql)
        
        if(resultStatus)
            return true
        else
            return false

    } catch (error) {
        return false
    }

}

// Remover um filme do destaque
const updateRemoverDestaque = async (idFilme) => {

 try {

        let sql = `update tbl_filme set destaque = false where id = ${idFilme}`
        let resultStatus = await prisma.$executeRawUnsafe(sql)
        
        if(resultStatus)
            return true
        else
            return false

    } catch (error) {
        return false
    }

}

// Deletar um filme existente filtrando pelo ID
const deleteFilme = async (id) => {

    try {

        // Exclui o filme por id
        let sql = `delete from tbl_filme where id = ${id}`

        // Executa no Banco de Dado o script SQL
        let rsFilmes = await prisma.$executeRawUnsafe(sql)

        return rsFilmes


    } catch (error) {

        return false

    }

}

// Listar todos os filmes existentes na tabela
const selectAllFilmes = async () => {   

    try {

        // Script sql para listar todos os registros
        let sql = `select tf.id, tf.nome, tf.sinopse, time_format(tf.duracao, '%H:%i:%S') as duracao, date_format(tf.data_lancamento, '%d-%m-%Y') as data_lancamento, tf.foto_capa, tf.foto_banner, tf.destaque, tf.link_trailer, tf.id_classificacao, tc.sigla as classificacao, tc.classificacao_indicativa from tbl_filme as tf inner join tbl_classificacao as tc on tf.id_classificacao=tc.id order by tf.id desc`
        
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
        let sql = `select tf.id, tf.nome, tf.sinopse, time_format(tf.duracao, '%H:%i:%S') as duracao, date_format(tf.data_lancamento, '%d-%m-%Y') as data_lancamento, tf.foto_capa, tf.foto_banner, tf.destaque, tf.link_trailer, tf.id_classificacao, tc.sigla as classificacao, tc.classificacao_indicativa from tbl_filme as tf inner join tbl_classificacao as tc on tf.id_classificacao=tc.id where tf.id = ${id}`

        // Executa no Banco de Dado o script SQL
        let rsFilmes = await prisma.$queryRawUnsafe(sql)

        return rsFilmes


    } catch (error) {

        return false

    }

}

// Buscar os filmes de um ator filtrando pelo ID
const selectAllFilmesByAtor = async (id) => {

    try {

        // Realiza a busca do Filme pelo ID
        let sql = `select tf.id, tf.nome, tf.sinopse, time_format(tf.duracao, '%H:%i:%S') as duracao, date_format(tf.data_lancamento, '%d-%m-%Y') as data_lancamento, tf.foto_capa, tf.foto_banner, tf.destaque, tf.link_trailer, tf.id_classificacao, tc.sigla as classificacao, tc.classificacao_indicativa from tbl_filme as tf inner join tbl_classificacao as tc on tf.id_classificacao=tc.id inner join tbl_filme_ator as tfa on tf.id=tfa.id_filme where tfa.id_ator = ${id}`

        // Executa no Banco de Dado o script SQL
        let rsFilmes = await prisma.$queryRawUnsafe(sql)

        return rsFilmes


    } catch (error) {

        return false

    }

}

// Buscar os filmes de um gênero filtrando pelo ID
const selectAllFilmesByGenero = async (id) => {

    try {

        // Realiza a busca do Filme pelo ID
        let sql = `select tf.id, tf.nome, tf.sinopse, time_format(tf.duracao, '%H:%i:%S') as duracao, date_format(tf.data_lancamento, '%d-%m-%Y') as data_lancamento, tf.foto_capa, tf.foto_banner, tf.destaque, tf.link_trailer, tf.id_classificacao, tc.sigla as classificacao, tc.classificacao_indicativa from tbl_filme as tf inner join tbl_classificacao as tc on tf.id_classificacao=tc.id inner join tbl_filme_genero as tfg on tf.id=tfg.id_filme where tfg.id_genero = ${id}`

        // Executa no Banco de Dado o script SQL
        let rsFilmes = await prisma.$queryRawUnsafe(sql)

        return rsFilmes


    } catch (error) {

        return false

    }

}

// Buscar os filmes favoritos de um perfil filtrando pelo ID
const selectAllFilmesFavoritosByPerfil = async (id) => {

    try {

        // Realiza a busca do Filme pelo ID
        let sql = `select tf.id, tf.nome, tf.sinopse, time_format(tf.duracao, '%H:%i:%S') as duracao, date_format(tf.data_lancamento, '%d-%m-%Y') as data_lancamento, tf.foto_capa, tf.foto_banner, tf.destaque, tf.link_trailer, tf.id_classificacao, tc.sigla as classificacao, tc.classificacao_indicativa from tbl_filme as tf inner join tbl_classificacao as tc on tf.id_classificacao=tc.id inner join tbl_filme_favorito as tff on tf.id=tff.id_filme where tff.id_perfil = ${id}`

        // Executa no Banco de Dado o script SQL
        let rsFilmes = await prisma.$queryRawUnsafe(sql)

        return rsFilmes


    } catch (error) {

        return false

    }

}

// Buscar filmes existentes filtrando pelo nome
const selectByName = async (nome) => {

    try {

        // Script sql para listar todos os registros
        let sql = `select tf.id, tf.nome, tf.sinopse, time_format(tf.duracao, '%H:%i:%S') as duracao, date_format(tf.data_lancamento, '%d-%m-%Y') as data_lancamento, tf.foto_capa, tf.foto_banner, tf.destaque, tf.link_trailer, tf.id_classificacao, tc.sigla as classificacao, tc.classificacao_indicativa from tbl_filme as tf inner join tbl_classificacao as tc on tf.id_classificacao=tc.id where tf.nome like '%${nome}%'`

        // $queryRawUnsafe(sql) -- Encaminha apenas a variável
        // $queryRaw('select * from table tbl_filmes') -- Encaminha o script

        // Executa o script sql no banco de dados e recebe o retorno na variável rsFilmes
        let rsFilmes = await prisma.$queryRawUnsafe(sql)

        return rsFilmes
        

    } catch (error) {

        return false

    }

}

// Buscar o id do filme em destaque
const selectIdDestaque = async () => {
    
    try {

        let sql = 'select id from tbl_filme where destaque = true'
    
        let rsFilmes = await prisma.$queryRawUnsafe(sql)
    
        return rsFilmes
        
    } catch (error) {
 
        return false

    }

}

// Buscar o id do último item da tabela
const selectLastId = async () => {
    
    try {

        let sql = 'select cast(last_insert_id() as DECIMAL) as id from tbl_filme limit 1'
    
        let rsFilmes = await prisma.$queryRawUnsafe(sql)
    
        return rsFilmes
        
    } catch (error) {
 
        return false

    }

}

// Buscar o menor id da tabela
const selectMinId = async () => {
    
    try {

        let sql = 'select MIN(id) as id from tbl_filme'
    
        let rsFilmes = await prisma.$queryRawUnsafe(sql)
    
        return rsFilmes
        
    } catch (error) {
 
        return false

    }

}

module.exports = {
    insertFilme,
    updateFilme,
    updateAdicionarDestaque,
    updateRemoverDestaque,
    deleteFilme,
    selectAllFilmes,
    selectByIdFilme,
    selectAllFilmesByAtor,
    selectAllFilmesByGenero,
    selectAllFilmesFavoritosByPerfil,
    selectByName,
    selectIdDestaque,
    selectLastId,
    selectMinId
}