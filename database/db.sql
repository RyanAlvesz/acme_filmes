create schema db_acme_filmes_turma_ab;

use db_acme_filmes_turma_ab;

-- creates

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

-- Inserts

insert into tbl_classificacao (
					sigla,
					descricao,
                    classificacao_indicativa,
                    icone
				 ) values (
					'Livre',
                    'Histórias sem conteúdos pontencialmente prejudiciais para qualquer faixa etária',
                    'Livre para todos os públicos',
                    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/DJCTQ_-_L.svg/1024px-DJCTQ_-_L.svg.png'
                 ), (
					'10',
                    'Histórias de conteúdo violento e linguagem imprópria de nível leve',
                    'Não recomendado para menores de 10 anos',
                    'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/DJCTQ_-_10.svg/1024px-DJCTQ_-_10.svg.png'
                 ), (
					'12',
                    'Histórias com cenas de agressão física, insinuação de consumo de drogas e insinuação leve de sexo',
                    'Não recomendado para menores de 12 anos',
                    'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/DJCTQ_-_12.svg/1024px-DJCTQ_-_12.svg.png'
                 ), (
					'14',
                    'Histórias com agressão física média, consumo de drogas explícito e insinuação de sexo moderada',
                    'Não recomendado para menores de 14 anos',
                    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/DJCTQ_-_14.svg/1024px-DJCTQ_-_14.svg.png'
                 ), (
					'16',
                    'Histórias com consumo de drogas explícito, agressão física acentuada e insinuação de sexo acentuada',
                    'Não recomendado para menores de 16 anos',
                    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/DJCTQ_-_16.svg/1024px-DJCTQ_-_16.svg.png'
                 ), (
					'18',
                    'Histórias com consumo e indução ao consumo de drogas, violência extrema, suicídio, cenas de sexo explícitas, e distúrbios psicossomáticos',
                    'Não recomendado para menores de 18 anos',
                    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/DJCTQ_-_18.svg/1024px-DJCTQ_-_18.svg.png'
                 );

insert into tbl_filme ( 
						nome,
                        sinopse,
                        duracao,
                        data_lancamento,
                        foto_capa,
                        foto_banner,
                        destaque,
                        link_trailer,
                        id_classificacao
					   ) values (
                       'Barbie',
                       'No fabuloso live-action da boneca mais famosa do mundo, acompanhamos o dia a dia em Barbieland - o mundo mágico das Barbies, onde todas as versões da boneca vivem em completa harmonia e suas únicas preocupações são encontrar as melhores roupas para passear com as amigas e curtir intermináveis festas. Porém, uma das bonecas (interpretada por Margot Robbie) começa a perceber que talvez sua vida não seja tão perfeita assim, questionando-se sobre o sentido de sua existência e alarmando suas companheiras. Logo, sua vida no mundo cor-de-rosa começa a mudar e, eventualmente, ela sai de Barbieland. Forçada a viver no mundo real, Barbie precisa lutar com as dificuldades de não ser mais apenas uma boneca - pelo menos ela está acompanhada de seu fiel e amado Ken (Ryan Gosling), que parece cada vez mais fascinado pela vida no novo mundo. Enquanto isso, Barbie tem dificuldades para se ajustar, e precisa enfrentar vários momentos nada coloridos até descobrir que a verdadeira beleza está no interior de cada um.',
                       '01:55:00',
                       '2023-07-20',
                       'https://br.web.img2.acsta.net/pictures/23/04/05/09/34/1483846.jpg',
					   'https://cdn.folhape.com.br/img/pc/1100/1/dn_arquivo/2023/04/fs4eedswiau8bzi.jpg',
                       false,
                       'https://www.youtube.com/watch?v=pBk4NYhWNMM',
                       3
                       ), (
                       'Kill Bill - Volume 1',
                       'A Noiva (Uma Thurman) é uma perigosa assassina que trabalhava em um grupo, liderado por Bill (David Carradine), composto principalmente por mulheres. Grávida, ela decide escapar dessa vida de violência e decide se casar, mas no dia da cerimônia seus companheiros de trabalho se voltam contra ela, quase a matando. Após cinco anos em coma, ela desperta sem um bebê e com um único desejo: vingança. A Noiva decide procurar, e matar, as cinco pessoas que destruiram o seu futuro, começando pelas perigosas assassinas Vernita Green (Vivica A. Fox) e O-Ren Ishii (Lucy Liu).',
                       '01:52:00',
                       '2004-04-23',
                       'https://br.web.img3.acsta.net/c_310_420/medias/nmedia/18/89/48/24/20122126.jpg',
                       'https://gizmodo.uol.com.br/wp-content/blogs.dir/8/files/2021/10/killbill.jpg',
                       true,
					   'https://www.youtube.com/watch?v=7kSuas6mRpk',
                       6
                       );

insert into tbl_diretor (
					nome
				 ) values (
					'Quentin Tarantino'
                 ), (
					'Greta Gerwig'
                 );
                 
insert into tbl_filme_diretor (
					id_filme,
                    id_diretor
				 ) values (
					1,
                    2
                 ), (
					2,
                    1
                 );
                 
insert into tbl_genero (
					nome
				 ) values (
					'Ação'
                 ), (
					'Comédia'
                 ), (
					'Drama'
                 ), (
					'Aventura'
                 );
                 
insert into tbl_filme_genero (
					id_filme,
                    id_genero
				 ) values (
					1,
                    2
                 ), (
					1,
                    3
                 ), (
					2,
                    1
                 ), (
					2,
                    4
                 );

insert into tbl_nacionalidade (
					pais,
                    nome,
                    bandeira
				 ) values (
					'Estados Unidos',
					'Estadounidense',
                    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Flag_of_the_United_States_%28DoS_ECA_Color_Standard%29.svg/1920px-Flag_of_the_United_States_%28DoS_ECA_Color_Standard%29.svg.png'
                 ), (
					'Brasil',
					'Brasileiro',
                    'https://upload.wikimedia.org/wikipedia/en/thumb/0/05/Flag_of_Brazil.svg/1280px-Flag_of_Brazil.svg.png'
                 );

insert into tbl_ator (
					nome,
                    foto,
                    biografia,
                    data_nascimento,
                    data_falecimento
				 ) values (
					'Uma Thurman',
					'https://br.web.img3.acsta.net/pictures/19/08/29/21/14/0483094.jpg',
                    'Uma Karuna Thurman é uma atriz norte-americana vencedora de um Globo de Ouro e indicada ao Oscar. Ficou famosa por fazer papéis destacados nos filmes do diretor-escritor Quentin Tarantino, como Pulp Fiction, e, na sequência, as duas partes de Kill Bill.',
                    '1970-04-29',
                    null
                 ), (
					'Margot Robbie',
					'https://s2-epocanegocios.glbimg.com/x2IhXKs3IuLQEKZ2vpS7YWB-D8g=/0x0:743x1024/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_e536e40f1baf4c1a8bf1ed12d20577fd/internal_photos/bs/2023/o/O/i9Xpn7TAAMPe9ECFUSrw/margot.jpg',
                    'Margot Elise Robbie é uma atriz e produtora australiana, indicada a dois Óscares, quatro Globos de Ouro e cinco BAFTAs. Em 2017, a revista Time a nomeou uma das 100 pessoas mais influentes do mundo, e, em 2019, foi classificada entre as atrizes mais bem pagas do mundo pela Forbes.',
                    '1990-07-02',
                    null
                 );
                 
insert into tbl_filme_ator (
					id_filme,
                    id_ator
				 ) values (
					1,
                    2
                 ), (
					2,
                    1
                 );

insert into tbl_nacionalidade_ator (
					id_ator,
                    id_nacionalidade
				 ) values (
					1,
                    1
                 ), (
					2,
                    1
                 );
                 
insert into tbl_usuario (
					nome,
                    email,
                    senha
				 ) values (
					'Gabriela Fernandes Calvacanti',
                    'gabriela@email.com',
                    md5('1234')
                 );

insert into tbl_categoria_foto_perfil (
					nome
				 ) values (
					'Django Livre'
                 );

insert into tbl_foto_perfil (
					foto,
                    nome,
					id_categoria_foto_perfil
				 ) values (
					'https://www.indiewire.com/wp-content/uploads/2018/07/Screen-Shot-2018-07-18-at-3.05.24-PM.png',
                    'Django',
                    1
                 );
                 
insert into tbl_perfil (
					apelido,
					id_usuario,
					id_foto_perfil
				 ) values (
					'Gabie',
                    1,
                    1
                 );                 

insert into tbl_filme_favorito (
					id_filme,
					id_perfil
				 ) values (
                    1,
                    1
                 ), (
					2,
                    1
                 );

insert into tbl_funcionario (
					nome,
                    email,
                    senha
				 ) values (
					'Ryan Alves de Carvalho',
                    'ryan@email.com',
                    md5('1234')
                 );
              
              

# TRIGGERS

DELIMITER $
create trigger tgr_delete_filme 
	before delete on tbl_filme
		for each row
			begin
				delete from tbl_filme_genero where id_filme = old.id;
				delete from tbl_filme_ator where id_filme = old.id;
				delete from tbl_filme_diretor where id_filme = old.id;
				delete from tbl_filme_favorito where id_filme = old.id;
			end $
            
DELIMITER $
create trigger tgr_delete_ator
	before delete on tbl_ator
		for each row
			begin
				delete from tbl_nacionalidade_ator where id_ator = old.id;
				delete from tbl_filme_ator where id_ator = old.id;
			end $
            
DELIMITER $
create trigger tgr_delete_nacionalidade
	before delete on tbl_nacionalidade
		for each row
			begin
				delete from tbl_nacionalidade_ator where id_nacionalidade = old.id;
			end $
            
DELIMITER $
create trigger tgr_delete_diretor
	before delete on tbl_diretor
		for each row
			begin
				delete from tbl_filme_diretor where id_diretor = old.id;
			end $
            
DELIMITER $
create trigger tgr_delete_genero
	before delete on tbl_genero
		for each row
			begin
				delete from tbl_filme_genero where id_genero = old.id;
			end $
            
DELIMITER $
create trigger tgr_delete_perfil
	before delete on tbl_perfil
		for each row
			begin
				delete from tbl_filme_favorito where id_perfil = old.id;
			end $


DELIMITER $
create trigger tgr_delete_usuario
	before delete on tbl_usuario
		for each row
			begin
				delete from tbl_perfil where id_usuario = old.id;
			end $

DELIMITER $
create trigger tgr_delete_foto_perfil
	before delete on tbl_foto_perfil
		for each row
			begin
				update tbl_perfil set id_foto_perfil = 1 where id_foto_perfil = old.id;
			end $


DELIMITER $
create trigger tgr_delete_categoria_foto_perfil
	before delete on tbl_categoria_foto_perfil
		for each row
			begin
				delete from tbl_foto_perfil where id_categoria_foto_perfil = old.id;
			end $
            

show triggers;
drop trigger delete_filme;
              
# Procedures
# Permite criar uma procedure
### Na passagem de parametros existem 3 tipos (IN, OUT, INOUT)
## IN    - significa que a procedure recebe um parâmetro de entrada
## OUT   - significa que a procedure devolve um parâmetro de saída
## INOUT - significa que a procedure recebe um parâmetro de entrada e devolve um parâmetro de saída

## Permite definir um delimitador de término da procedure
DELIMITER $$
create procedure procListaFilme (IN idFilme int)
BEGIN
	if idFilme > 0 then
		select id, nome, sinopse, time_format(duracao, '%H:%i:%S') as duracao, date_format(data_lancamento, '%Y-%m-%d') as data_lancamento, date_format(data_relancamento, '%Y-%m-%d') as data_relancamento, foto_capa, valor_unitario from tbl_filme
		where tbl_filme.id = idFilme;
	else 
		select id, nome, sinopse, time_format(duracao, '%H:%i:%S') as duracao, date_format(data_lancamento, '%Y-%m-%d') as data_lancamento, date_format(data_relancamento, '%Y-%m-%d') as data_relancamento, foto_capa, valor_unitario from tbl_filme order by id desc;
	end if;
END $$

# Lista as procedures existentes no Banco de Dados
-- show procedure status;

# Executa a procedure no Banco de Dados
call procListaFilme(0);

# Remove a procedure do Banco de Dados
drop procedure procListaFilme;

create view viewListaFilme as select * from procListaFilme(0);

drop view viewListaFilme;

select * from viewListaFilme;


                       