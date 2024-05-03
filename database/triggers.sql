use db_acme_filmes_turma_ab;

-- TRIGGERS

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

DELIMITER $
create trigger tgr_update_add_destaque
	before update on tbl_filme
		for each row
			begin
				if (old.destaque = true or old.destaque = 1) then	
					update tbl_filme set destaque = false where id > 0;
                end if;
			end $

DELIMITER ;