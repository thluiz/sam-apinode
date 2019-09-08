CREATE procedure MoveCard(    
 @card_id int,     
 @parent_id int,    
 @step_id int,    
 @responsible_id int    
) as    
begin    
 declare @current_project int = (select parent_id from card where id = @card_id)    
 
 if(exists(select 1 from card_step where id = @step_id and card_id != @parent_id)) 
	set @step_id = (select top 1 id from card_step where card_id = @parent_id order by [order], id) 
    
 update [card] set parent_id = @parent_id, current_step_id = @step_id    
 where id = @card_id     
    
 if(@current_project != @parent_id)  
	exec SaveCardHistory @card_id, 2, @responsible_id, @new_parent_id = @parent_id    
    
 exec SaveCardStep @card_id, @step_id, @responsible_id    
    
end