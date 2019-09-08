CREATE procedure GenerateIncidentsForCard(    
 @card_id int    
)    
as    
begin
	declare @due_date datetime, @type int = 29, @leader_id int, @created_by int, @branch_id int, @template_id int, @archived bit    
        
	select @due_date = due_date, @leader_id = leader_id,     
		@created_by = created_by, @template_id = card_template_id,  
		@archived = archived    
	from [card] where id = @card_id   

	-- projects does not generate incidents    
	if(exists(select 1 from [card] where parent_id = @card_id))    
		return            
  
	-- only register incident for real tasks    
	if(@template_id not in (1, 3))    
		return    
  
	 -- archived incidents if:  
	 --    a) card is archived   
	 --    b) due time is removed  
	 if(@archived = 1 or (exists(select 1 from incident where card_id = @card_id) and CONVERT(TIME, @due_date) = '00:00:00.0000000'))  
	 begin  
		update incident set cancelled = 1 where card_id = @card_id  
		return  
	 end  
  
	if(@template_id = 1)  
		set @type = 5   
    
	-- only register incident if it has due date    
	if(@due_date is null)    
		return    
  
	-- only register incident if it has due time    
	if(CONVERT(TIME, @due_date) = '00:00:00.0000000')    
		return  
     
	-- only register incident if it does not exists yet     
	if(exists(select 1 from incident where card_id = @card_id and cancelled = 0))     
		return    
    
	select @branch_id = branch_id from person where id = @leader_id    
    
		exec RegisterNewIncident @type = @type, @branch = @branch_id, @people = @leader_id, @date = @due_date, @responsible_id = @created_by, @card_id = @card_id    
    
end