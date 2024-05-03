create schema db_acme_filmes_turma_ab;

use db_acme_filmes_turma_ab;

-- CREATES

create table tbl_classificacao (

	id integer not null auto_increment primary key,
	sigla varchar(5) not null,
    descricao varchar(150) not null,
    classificacao_indicativa varchar(150) not null,
	icone text not null
    
);

create table tbl_filme (
	id integer not null auto_increment primary key,
    nome varchar(80) not null,
    sinopse text not null,
    duracao time not null,
    data_lancamento date not null,
	foto_capa text not null,
    foto_banner text not null,
    destaque boolean not null,
    link_trailer varchar(200) not null,
    id_classificacao integer not null,

    unique index(id),
    unique key (id),
    
    foreign key (id_classificacao) references tbl_classificacao(id)

);

create table tbl_diretor (
	id integer not null auto_increment primary key,
	nome varchar(100) not null,
    
	unique index(id),
    unique key (id)
);

create table tbl_filme_diretor (
	id integer not null auto_increment primary key,
    id_filme integer not null,
    id_diretor integer not null,
    
	unique index(id),
    unique key (id),
    
    foreign key (id_filme) references tbl_filme(id),
    foreign key (id_diretor) references tbl_diretor(id)
);

create table tbl_genero (
	id integer not null auto_increment primary key,
	nome varchar(100) not null
);

create table tbl_filme_genero (
	id integer not null auto_increment primary key,
    id_filme integer not null,
    id_genero integer not null,
    
	unique index(id),
    unique key (id),
    
    foreign key (id_filme) references tbl_filme(id),
    foreign key (id_genero) references tbl_genero(id)
);

create table tbl_nacionalidade (
	id integer not null auto_increment primary key,
	pais varchar(150) not null,
    nome varchar(150) not null,
    bandeira text not null,
    
	unique index(id),
    unique key (id)
);

create table tbl_ator (
	id integer not null auto_increment primary key,
	nome varchar(150) not null,
    foto text not null,
    biografia text not null,
    data_nascimento date not null,
    data_falecimento date,
    
	unique index(id),
    unique key (id)
);

create table tbl_filme_ator (
	id integer not null auto_increment primary key,
    id_filme integer not null,
    id_ator integer not null,
    
	unique index(id),
    unique key (id),
    
    foreign key (id_filme) references tbl_filme(id),
    foreign key (id_ator) references tbl_ator(id)
);

create table tbl_nacionalidade_ator (
	id integer not null auto_increment primary key,
    id_nacionalidade integer not null,
    id_ator integer not null,
    
	unique index(id),
    unique key (id),
    
    foreign key (id_nacionalidade) references tbl_nacionalidade(id),
    foreign key (id_ator) references tbl_ator(id)
);

create table tbl_usuario (
	id integer not null auto_increment primary key,
	nome varchar(100) not null,
    email varchar(100) not null,
    senha varchar(50) not null,
    
	unique index(id),
    unique key(email),
    unique key (id)
);

create table tbl_categoria_foto_perfil (
	id integer not null auto_increment primary key,
	nome varchar(100)
);

create table tbl_foto_perfil (
	id integer not null auto_increment primary key,
    foto text,
    nome varchar(50),
    id_categoria_foto_perfil integer not null,
        
	unique index(id),
    unique key (id),

	foreign key (id_categoria_foto_perfil) references tbl_categoria_foto_perfil(id)
);

create table tbl_perfil (
	id integer not null auto_increment primary key,
    apelido varchar(80) not null,
    id_usuario integer not null,
    id_foto_perfil integer not null,
    
	unique index(id),
    unique key (id),
    
    foreign key (id_usuario) references tbl_usuario(id),
    foreign key (id_foto_perfil) references tbl_foto_perfil(id)
);

create table tbl_filme_favorito (
	id integer not null auto_increment primary key,
	id_filme integer not null,
	id_perfil integer not null,
    
	unique index(id),
    unique key (id),

    foreign key (id_filme) references tbl_filme(id),
    foreign key (id_perfil) references tbl_perfil(id) 
);

create table tbl_funcionario (
	id integer not null auto_increment primary key,
	nome varchar(100) not null,
    email varchar(100) not null,
    senha varchar(50) not null,
    
	unique index(id),
	unique key(email),
    unique key (id)
);              