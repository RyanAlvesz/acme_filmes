/****************************************************************************************************************************************************
* Objetivo: Arquivo responsável pelas configurações globais de mensagens, valores e conteúdos para projetos
* Data: 20/02/2024
* Autor: Ryan Alves
* Versão: 1.0
****************************************************************************************************************************************************/

/****************************************************************************************************************************************************
*                                                              Mensagens de Erro
****************************************************************************************************************************************************/

const ERROR_INVALID_ID = {
    status: false,
    status_code: 400,
    message: 'O ID encaminhado na requisição não é válido'
}

const ERROR_NOT_FOUND = {
    status: false,
    status_code: 404,
    message: 'Nenhum item encontrado na requisição'
}

const ERROR_REQUIRED_FIELDS = {
    status: false,
    status_code: 400,
    message: 'O parâmetro encaminhado na requisição não é valido'
}

const ERROR_CONTENT_TYPE = {
    status: false,
    status_code: 415,
    message: 'O Contet-Type da requisição não é suportado. Precisam ser enviados dados no formato application/json'
}

const ERROR_INTERNAL_SERVER_DB = {
    status: false,
    status_code: 500,
    message: 'Ocorrem erros internos no servidor do banco de dados, por favor contate o administrador do sistema'
}

const ERROR_INTERNAL_SERVER = {
    status: false,
    status_code: 500,
    message: 'Ocorrem erros internos no servidor na camada de negócio da API, por favor contate o administrador do sistema'
}

/****************************************************************************************************************************************************
*                                                              Mensagens de Sucesso
****************************************************************************************************************************************************/

const UPDATED_ITEM = {
    status: true,
    status_code: 200,
    message: 'Registro atualizada com sucesso'
}

const DELETED_ITEM = {
    status: true,
    status_code: 200,
    message: 'Item deletado com sucesso'
}

const CREATED_ITEM = {
    status: true,
    status_code: 201,
    message: 'Registro criado com sucesso'
}


module.exports = {
    ERROR_INVALID_ID,
    ERROR_NOT_FOUND,
    ERROR_REQUIRED_FIELDS,
    ERROR_INTERNAL_SERVER_DB,
    ERROR_INTERNAL_SERVER,
    ERROR_CONTENT_TYPE,
    DELETED_ITEM,
    UPDATED_ITEM,
    CREATED_ITEM
}