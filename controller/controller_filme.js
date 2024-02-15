/****************************************************************************************************************************************************
* Objetivo: Arquivo responsável pela interação entre o APP e a Model, que teremos todas as trativas e regras de negócio para o CRUD de filmes
* Data: 30/01/2024
* Autor: Ryan Alves
* Versão: 1.0
****************************************************************************************************************************************************/

// Import do arquivo DAO para manipular dados dos BD
const filmesDAO = require('../model/DAO/filme.js')

//Função para inserir um novo filme no Banco de Dados
const setNovoFilme = async() => {}

//Função para atualizar um filme existente
const setAtualizarFilme = async() => {}

//Função para excluir um filme existente
const setExcluirFilme = async(id) => {}

//Função para retornar todos os filmes do Banco de Dados
const getListarFilmes = async() => {

    // Cria a variável do tipo JSON     
    let filmesJSON = {}

    // Chama a função do DAO para buscar os dados do BD
    let dadosFilmes = await filmesDAO.selectAllFilmes()

    // Verifica se existem dados retornados
    if(dadosFilmes){

        // Montando o JSON para retornar 
        filmesJSON.filmes = dadosFilmes
        filmesJSON.quantidade = dadosFilmes.lenght
        filmesJSON.status_code = 200
        // Retorna o JSON montado
        return filmesJSON

    }else{
        
        // Retorna falso quando não houver dados
        return false

    }

}


// Função para retornar todos os filmes correspondentes do filtro
const getFilmesNome = async(filtro) => {

    // Cria a variável do tipo JSON     
    let filmesJSON = {}

    // Recebendo o parâmetro de pesquisa
    let nome = filtro

    // Chama a função do DAO para buscar os dados do BD
    let dadosFilmes = await filmesDAO.selectByName(nome)

    // Verifica se existem dados retornados
    if(dadosFilmes){

        // Montando o JSON para retornar 
        filmesJSON.filmes = dadosFilmes
        filmesJSON.quantidade = dadosFilmes.lenght
        filmesJSON.status_code = 200
        // Retorna o JSON montado
        return filmesJSON

    }else{
        
        // Retorna falso quando não houver dados
        return false

    }

}

//Função para buscar filme pelo id
const getBuscarFilme = async(id) => {}

module.exports = {
    setNovoFilme,
    setAtualizarFilme,
    setExcluirFilme,
    getListarFilmes,
    getBuscarFilme,
    getFilmesNome
}