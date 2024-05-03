# Parte de estudo 

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

call procUpdateFilmeDestaque(8);

# Lista as procedures existentes no Banco de Dados

-- show procedure status;

# Executa a procedure no Banco de Dados
call procListaFilme(0);

# Remove a procedure do Banco de Dados
drop procedure procListaFilme;
drop procedure procUpdateFilmeDestaque

drop view viewListaFilme;

select * from viewListaFilme;