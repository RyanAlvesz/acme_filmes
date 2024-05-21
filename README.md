<h1 align="center"> 💙 ACME Filmes 💖 </h1>

<div align="center">  
<img src="https://img.shields.io/badge/Node.js-880000?style=for-the-badge&logo=node.js&logoColor=white" />
<img src="https://img.shields.io/badge/JavaScript-142A4B?style=for-the-badge&logo=javascript&logoColor=white" />
<img src="https://img.shields.io/badge/Express.js-880000?style=for-the-badge&logo=express&logoColor=white" />
<img src="https://img.shields.io/badge/mysql-142A4B?style=for-the-badge&logo=mysql&logoColor=white" />
<img src="https://img.shields.io/badge/prisma-880000?style=for-the-badge&logo=prisma&logoColor=white" />
<img src="https://img.shields.io/badge/microsoft azure-142A4B?style=for-the-badge&logo=microsoft azure&logoColor=white" />
<img src="https://img.shields.io/badge/render-880000?style=for-the-badge&logo=render&logoColor=white" />
</div>


## Descrição 🌺
- API desenvolvida com Node.js e MySQL
- Banco de dados hospedado na Azure e Backend no Render
- Retorna informações como categorias, usuários e pizzas
- Métodos disponíveis: GET, POST, UPDATE, DELETE


## Como utilizar 🥀

> **URL Base:** https://acme-filmes-backend-1qiz.onrender.com

### Endpoints

Endpoints - Filme                       | Método 
:--------------------------------------:|:------------------:  
/v2/acme_filmes/filmes                  | GET
/v2/acme_filmes/destaque                | GET
/v2/acme_filmes/filmes/filtro?nome      | GET
/v2/acme_filmes/filme/:id               | GET
/v2/acme_filmes/filmes/ator/:id         | GET
/v2/acme_filmes/filmes/generos/         | GET
/v2/acme_filmes/filmes/perfil/:id       | GET
/v2/acme_filmes/filme                   | POST
/v2/acme_filmes/filme/:id               | DELETE
/v2/acme_filmes/filme/:id               | UPDATE
/v2/acme_filmes/filme/add_destaque/:id  | UPDATE


## Exemplo de uso 🍀 

```
const response = await fetch('https://acme-filmes-backend-1qiz.onrender.com/v2/acme_filmes/filme/1')
```

### Resposta

```
{
 "filme": [
    {
      "id": 1,
      "nome": "Barbie",
      "sinopse": "Depois de ser expulsa da Barbieland por ser uma boneca de aparência menos do que perfeita, Barbie parte para o mundo humano em busca da verdadeira felicidade.",
      "duracao": "01:54",
      "data_lancamento": "2023-07-20",
      "foto_capa": "https://firebasestorage.googleapis.com/v0/b/acme-filmes.appspot.com/o/images%2Fmovies%2Fbarbie-poster.jpeg?alt=media&token=66a2bf28-3cac-492f-b5ed-9b507637cc64",
      "foto_banner": "https://firebasestorage.googleapis.com/v0/b/acme-filmes.appspot.com/o/images%2Fmovies%2Fbarbie-banner.jpeg?alt=media&token=7fc93be0-d543-4fb1-89fe-7b7d744e183c",
      "destaque": 0,
      "link_trailer": "https://www.youtube.com/watch?v=OCaRcYfy3m8&ab_channel=WarnerBros.PicturesBrasil",
      "id_classificacao": 3,
      "classificacao": [
        {
          "id": 3,
          "sigla": "12",
          "descricao": "Histórias com cenas de agressão física, insinuação de consumo de drogas e insinuação leve de sexo",
          "classificacao_indicativa": "Não recomendado para menores de 12 anos",
          "icone": "https://firebasestorage.googleapis.com/v0/b/acme-filmes.appspot.com/o/images%2Fratings%2F12.webp?alt=media&token=d127d297-7cda-4e46-8561-9e35b9058098"
        }
      ],
      "generos": [
        {
          "id": 2,
          "nome": "Comédia"
        },
        {
          "id": 8,
          "nome": "Romance"
        },
        {
          "id": 4,
          "nome": "Aventura"
        },
        {
          "id": 6,
          "nome": "Fantasia"
        },
        {
          "id": 3,
          "nome": "Drama"
        }
      ],
      "diretores": [
        {
          "id": 2,
          "nome": "Greta Gerwig"
        }
      ],
      "atores": [
        {
          "id": 2,
          "nome": "Margot Robbie",
          "foto": "https://firebasestorage.googleapis.com/v0/b/acme-filmes.appspot.com/o/images%2Factors%2Fmargot-robbie.jpeg?alt=media&token=c0c08e0a-8da9-4bd1-909b-b0545af11d7c",
          "biografia": "Margot Elise Robbie é uma atriz e produtora australiana, indicada a dois Óscares, quatro Globos de Ouro e cinco BAFTAs. Em 2017, a revista Time a nomeou uma das 100 pessoas mais influentes do mundo, e, em 2019, foi classificada entre as atrizes mais bem pagas do mundo pela Forbes.",
          "data_nascimento": "1990-07-02",
          "data_falecimento": null,
          "nacionalidades": [
            {
              "id": 7,
              "gentilico": "Australiana",
              "pais": "Austrália"
            }
          ]
        },
        {
          "id": 3,
          "nome": "Ryan Gosling",
          "foto": "https://firebasestorage.googleapis.com/v0/b/acme-filmes.appspot.com/o/images%2Factors%2Fryan-gosling.jpg?alt=media&token=67576a39-a9e7-4597-9b68-ec91484e6b64",
          "biografia": "Ryan Thomas Gosling é um ator, músico, produtor e diretor de cinema canadense. Ele começou sua carreira como um ator mirim no programa da Disney Channel, Clube do Mickey, e passou a aparecer em outros programas de entretenimento familiar, incluindo as séries de terror infantil Você Tem Medo do Escuro? e Goosebumps.",
          "data_nascimento": "1980-11-12",
          "data_falecimento": null,
          "nacionalidades": [
            {
              "id": 8,
              "gentilico": "Canadense",
              "pais": "Canadá"
            }
          ]
        }
      ]
    }
  ],
  "quantidade": 1,
  "status_code": 200
}
```

## Desenvolvimento local 🌼

### Clone o repositório

```
git clone https://github.com/RyanAlvesz/acme_filmes_backend.git 
```

### Execute no terminal

```
npm install
npm run prisma
npm run start
```