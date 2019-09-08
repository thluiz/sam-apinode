CREATE procedure [dbo].[AddAlias](    
 @person_id int,    
 @alias nvarchar(150),    
 @kf_name bit = 0,  
 @ideograms nvarchar(100) = null,
 @principal bit = 0
)    
as    
begin    

 if(@principal = 1)
	update person_alias set principal = 0 where person_id = @person_id
    
 if(@kf_name = 1 and exists(select 1 from person_alias where kungfu_name = 1 and person_id = @person_id))    
  delete from person_alias where person_id = @person_id and kungfu_name = 1    
    
 insert into person_alias(person_id, alias, kungfu_name, ideograms, principal)    
 values(@person_id, @alias, @kf_name, @ideograms, @principal)    
    
end