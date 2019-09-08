CREATE procedure [dbo].[UpdateCard](    
 @card_id int,     
 @title nvarchar(500),     
 @due_date datetime,    
 @description nvarchar(max),      
 @location_id int,    
 @abrev nvarchar(15),    
 @leader_id int, 
 @responsible_id int
)    
as    
begin     
 declare @is_task bit
  
 select @is_task = is_task  
 from card_template ct
	join card c on c.card_template_id = ct.id
 where c.id = @card_id  
   
	update [card] set 
		title = @title,
		[description] = @description,
		due_date = @due_date,
		leader_id = @leader_id,
		location_id = @location_id,
		abrev = @abrev
	where id = @card_id

	exec GenerateIncidentsForCard @card_id
	exec CheckCardsHasOverdueCards @card_id


 if(@is_task = 1)             
	 select * 
	 from vwCard  c   
	 where c.id = @card_id    
	 for json path    
 else
	exec GetProject @card_id


end