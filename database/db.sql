create schema db_acme_filmes_turma_ab;

use db_acme_filmes_turma_ab;

create table tbl_filme (
	id integer not null auto_increment primary key,
    nome varchar(80) not null,
    sinopse text not null,
    duracao time not null,
    data_lancamento date not null,
    data_relancamento date,
	foto_capa varchar(200),
    valor_unitario float,
    unique index(id),
    unique key (id)
);

insert into tbl_filme (
						nome,
                        sinopse,
                        duracao,
                        data_lancamento,
                        data_relancamento,
                        foto_capa,
                        valor_unitario
					   ) values (
                       'Barbie',
                       'No fabuloso live-action da boneca mais famosa do mundo, acompanhamos o dia a dia em Barbieland - o mundo mágico das Barbies, onde todas as versões da boneca vivem em completa harmonia e suas únicas preocupações são encontrar as melhores roupas para passear com as amigas e curtir intermináveis festas. Porém, uma das bonecas (interpretada por Margot Robbie) começa a perceber que talvez sua vida não seja tão perfeita assim, questionando-se sobre o sentido de sua existência e alarmando suas companheiras. Logo, sua vida no mundo cor-de-rosa começa a mudar e, eventualmente, ela sai de Barbieland. Forçada a viver no mundo real, Barbie precisa lutar com as dificuldades de não ser mais apenas uma boneca - pelo menos ela está acompanhada de seu fiel e amado Ken (Ryan Gosling), que parece cada vez mais fascinado pela vida no novo mundo. Enquanto isso, Barbie tem dificuldades para se ajustar, e precisa enfrentar vários momentos nada coloridos até descobrir que a verdadeira beleza está no interior de cada um.',
                       '01:55:00',
                       '2023-07-20',
                       null,
                       'https://br.web.img2.acsta.net/pictures/23/04/05/09/34/1483846.jpg',
                       null
                       ), (
                       'Kill Bill - Volume 1',
                       'A Noiva (Uma Thurman) é uma perigosa assassina que trabalhava em um grupo, liderado por Bill (David Carradine), composto principalmente por mulheres. Grávida, ela decide escapar dessa vida de violência e decide se casar, mas no dia da cerimônia seus companheiros de trabalho se voltam contra ela, quase a matando. Após cinco anos em coma, ela desperta sem um bebê e com um único desejo: vingança. A Noiva decide procurar, e matar, as cinco pessoas que destruiram o seu futuro, começando pelas perigosas assassinas Vernita Green (Vivica A. Fox) e O-Ren Ishii (Lucy Liu).',
                       '01:52:00',
                       '2004-04-23',
                       null,
                       'https://br.web.img3.acsta.net/c_310_420/medias/nmedia/18/89/48/24/20122126.jpg',
                       null
                       );

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


                       