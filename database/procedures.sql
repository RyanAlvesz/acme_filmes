use db_acme_filmes_turma_ab;

-- PROCEDURES

DELIMITER $$
create procedure procUpdateFilmeDestaque (IN idFilme int)
BEGIN
	update tbl_filme set destaque = false;
	update tbl_filme set destaque = true where id = idFilme;
END $$
DELIMITER ;