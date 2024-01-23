/****************************************************************************************************************************************************
* Objetivo: Arquivo de funções para organizar dados de uma empresa de filmes online
* Data: 23/01/2024
* Autor: Ryan Alves
* Versão: 1.0
****************************************************************************************************************************************************/

var dados = require('../model/filmes.js')

const getListaFilmes = () => {

    const filmes = dados.filmes.filmes

    let filmesJSON = {}
    let filmesARRAY = []

    filmes.forEach((filme) => {

        let filmesJSON = {

            id: filme.id,
            nome: filme.nome,
            sinopse: filme.sinopse,
            duracao: filme.duracao,
            data_lancamento: filme.data_lancamento,
            data_relancamento: filme.data_relancamento,
            foto_capa: filme.foto_capa,
            valor_unitario: filme.valor_unitario

        }

        filmesARRAY.push(filmesJSON)

    })


    filmesJSON.filmes = filmesARRAY
    filmesJSON.quantidade = filmesARRAY.length
    
    return filmesJSON

}

const getFilme = (idUsuario) => {

    const filmes = dados.filmes.filmes
    
    let filmeJSON = {}
    let id = idUsuario, status = false

    filmes.forEach((filme) => {

        if(filme.id == id){

            filmeJSON = {
    
                id: filme.id,
                nome: filme.nome,
                sinopse: filme.sinopse,
                duracao: filme.duracao,
                data_lancamento: filme.data_lancamento,
                data_relancamento: filme.data_relancamento,
                foto_capa: filme.foto_capa,
                valor_unitario: filme.valor_unitario
    
            }

            status = true

        }

    })

    if(status)
        return filmeJSON
    else
        return false

}

module.exports = {
    getListaFilmes,
    getFilme
}