create schema db_acme_filmes_turma_ab;

use db_acme_filmes_turma_ab;

create table tbl_classificacao (

	id integer not null auto_increment primary key,
	classificacao integer not null
    
);

create table tbl_filme (
	id integer not null auto_increment primary key,
    nome varchar(80) not null,
    sinopse text not null,
    duracao time not null,
    data_lancamento date not null,
    data_relancamento date,
	foto_capa varchar(200) not null,
    foto_banner varchar(200) not null,
    id_classificacao integer not null,
    destaque boolean not null,
    
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

create table tbl_ator (
	id integer not null auto_increment primary key,
	nome varchar(100) not null,
    foto varchar(255) not null,
    descricao text not null,
    data_nascimento date not null,
    
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

create table tbl_usuario (
	id integer not null auto_increment primary key,
	nome varchar(100) not null,
    email varchar(100) not null,
    senha varchar(20) not null,
    
	unique index(id),
    unique key (id)
);

create table tbl_categoria_foto_perfil (
	id integer not null auto_increment primary key,
	nome varchar(100)
);

create table tbl_foto_perfil (
	id integer not null auto_increment primary key,
    foto varchar(200),
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



insert into tbl_classificacao (
					classificacao
				 ) values (
					0
                 ), (
					10
                 ), (
					12
                 ), (
					14
                 ), (
					16
                 ), (
					18
                 );

insert into tbl_filme (
						nome,
                        sinopse,
                        duracao,
                        data_lancamento,
                        data_relancamento,
                        foto_capa,
                        foto_banner,
                        id_classificacao,
                        destaque
					   ) values (
                       'Barbie',
                       'No fabuloso live-action da boneca mais famosa do mundo, acompanhamos o dia a dia em Barbieland - o mundo mágico das Barbies, onde todas as versões da boneca vivem em completa harmonia e suas únicas preocupações são encontrar as melhores roupas para passear com as amigas e curtir intermináveis festas. Porém, uma das bonecas (interpretada por Margot Robbie) começa a perceber que talvez sua vida não seja tão perfeita assim, questionando-se sobre o sentido de sua existência e alarmando suas companheiras. Logo, sua vida no mundo cor-de-rosa começa a mudar e, eventualmente, ela sai de Barbieland. Forçada a viver no mundo real, Barbie precisa lutar com as dificuldades de não ser mais apenas uma boneca - pelo menos ela está acompanhada de seu fiel e amado Ken (Ryan Gosling), que parece cada vez mais fascinado pela vida no novo mundo. Enquanto isso, Barbie tem dificuldades para se ajustar, e precisa enfrentar vários momentos nada coloridos até descobrir que a verdadeira beleza está no interior de cada um.',
                       '01:55:00',
                       '2023-07-20',
                       null,
                       'https://br.web.img2.acsta.net/pictures/23/04/05/09/34/1483846.jpg',
					   'https://cdn.folhape.com.br/img/pc/1100/1/dn_arquivo/2023/04/fs4eedswiau8bzi.jpg',
                       3,
                       true
                       ), (
                       'Kill Bill - Volume 1',
                       'A Noiva (Uma Thurman) é uma perigosa assassina que trabalhava em um grupo, liderado por Bill (David Carradine), composto principalmente por mulheres. Grávida, ela decide escapar dessa vida de violência e decide se casar, mas no dia da cerimônia seus companheiros de trabalho se voltam contra ela, quase a matando. Após cinco anos em coma, ela desperta sem um bebê e com um único desejo: vingança. A Noiva decide procurar, e matar, as cinco pessoas que destruiram o seu futuro, começando pelas perigosas assassinas Vernita Green (Vivica A. Fox) e O-Ren Ishii (Lucy Liu).',
                       '01:52:00',
                       '2004-04-23',
                       null,
                       'https://br.web.img3.acsta.net/c_310_420/medias/nmedia/18/89/48/24/20122126.jpg',
                       'https://gizmodo.uol.com.br/wp-content/blogs.dir/8/files/2021/10/killbill.jpg',
                       6,
                       false
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
			 
insert into tbl_ator (
					nome,
                    foto,
                    descricao,
                    data_nascimento
				 ) values (
					'Uma Thurman',
					'https://br.web.img3.acsta.net/pictures/19/08/29/21/14/0483094.jpg',
                    'Uma Karuna Thurman é uma atriz norte-americana vencedora de um Globo de Ouro e indicada ao Oscar. Ficou famosa por fazer papéis destacados nos filmes do diretor-escritor Quentin Tarantino, como Pulp Fiction, e, na sequência, as duas partes de Kill Bill.',
                    '1970-04-29'
                 ), (
					'Margot Robbie',
					'https://s2-epocanegocios.glbimg.com/x2IhXKs3IuLQEKZ2vpS7YWB-D8g=/0x0:743x1024/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_e536e40f1baf4c1a8bf1ed12d20577fd/internal_photos/bs/2023/o/O/i9Xpn7TAAMPe9ECFUSrw/margot.jpg',
                    'Margot Elise Robbie é uma atriz e produtora australiana, indicada a dois Óscares, quatro Globos de Ouro e cinco BAFTAs. Em 2017, a revista Time a nomeou uma das 100 pessoas mais influentes do mundo, e, em 2019, foi classificada entre as atrizes mais bem pagas do mundo pela Forbes.',
                    '1990-07-02'
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

insert into tbl_usuario (
					nome,
                    email,
                    senha
				 ) values (
					'Gabriela Fernandes Calvacanti',
                    'gabriela@email.com',
                    'tuquinhoAlmoços321'
                 );

insert into tbl_categoria_foto_perfil (
					nome
				 ) values (
					'Django Livre'
                 );

insert into tbl_foto_perfil (
					foto,
					id_categoria_foto_perfil
				 ) values (
					'https://www.indiewire.com/wp-content/uploads/2018/07/Screen-Shot-2018-07-18-at-3.05.24-PM.png',
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


select f.nome, f.sinopse, c.classificacao as idade, g.nome as genero, a.nome as ator_principal, d.nome as diretor
from tbl_filme as f
inner join tbl_classificacao as c
on f.id_classificacao = c.id
inner join tbl_filme_genero as fg
on f.id = fg.id_filme 
inner join tbl_genero as g
on fg.id_genero = g.id
inner join tbl_filme_ator as fa
on f.id = fa.id_filme 
inner join tbl_ator as a
on fa.id_ator = a.id
inner join tbl_filme_diretor as fd
on f.id = fd.id_filme
inner join tbl_diretor as d
on fd.id_diretor = d.id
group by f.id;



update tbl_filme set 
						nome = 'Kill Bill - Volume 1',
                        sinopse = 'A Noiva (Uma Thurman) é uma perigosa assassina que trabalhava em um grupo, liderado por Bill (David Carradine), composto principalmente por mulheres. Grávida, ela decide escapar dessa vida de violência e decide se casar, mas no dia da cerimônia seus companheiros de trabalho se voltam contra ela, quase a matando. Após cinco anos em coma, ela desperta sem um bebê e com um único desejo: vingança. A Noiva decide procurar, e matar, as cinco pessoas que destruiram o seu futuro, começando pelas perigosas assassinas Vernita Green (Vivica A. Fox) e O-Ren Ishii (Lucy Liu).',
                        duracao = '01:52:00',
                        data_lancamento = '2004-04-23',
                        data_relancamento = null,
                        foto_capa = 'https://br.web.img3.acsta.net/c_310_420/medias/nmedia/18/89/48/24/20122126.jpg',
                        valor_unitario = null
					where id = 2;

select cast(last_insert_id() as DECIMAL) as id from tbl_filme limit 1;
 
select * from tbl_filme;
select id, nome, sinopse, time_format(duracao, '%H:%i:%S') as duracao, date_format(data_lancamento, '%Y-%m-%d') as data_lancamento, date_format(data_relancamento, '%Y-%m-%d') as data_relancamento, foto_capa, valor_unitario from tbl_filme order by id desc;


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

                       