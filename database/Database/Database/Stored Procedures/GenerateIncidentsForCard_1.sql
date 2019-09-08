CREATE procedure [dbo].[GenerateIncidentsForCard](          
 @card_id int          
)          
as          
begin      
 declare @due_date datetime, @type int = 29, @leader_id int, @created_by int, @branch_id int,       
   @template_id int, @archived bit, @location_id int, @incident_holder int, @parent_type int,  
   @register_closed bit = 0      
              
 select @due_date = c.due_date, @leader_id = c.leader_id,     
  @incident_holder = c.leader_id, -- por padrão o incident é vinculado ao dono da tarefa         
  @created_by = c.created_by, @template_id = c.card_template_id,        
  @archived = c.archived, @location_id = c.location_id,    
  @parent_type = parent.card_template_id         
 from [card] c    
 left join [card] parent on parent.id = c.parent_id    
 where c.id = @card_id         
      
 -- projects does not generate incidents          
 if(exists(select 1 from [card] where parent_id = @card_id))          
  return                  
        
 -- only register incident for real tasks          
 if(@template_id not in (1, 3))          
  return          
        
  -- archived incidents if:        
  --    a) card is archived         
  --    b) due time is removed        
  if(@archived = 1 or 
    (exists(select 1 from incident where card_id = @card_id) and CONVERT(TIME, @due_date) = '00:00:00.0000000'))        
  begin        
  update incident set cancelled = 1 where card_id = @card_id        
  return        
  end        
        
 -- ajustments for contact card  
 if(@template_id = 1)     
 begin       
  set @type = 5        
  set @register_closed = 1  
      
  set @incident_holder = (select person_id from person_card pc where pc.card_id = @card_id and position = 5)    
   
  if(@parent_type in (11, 12, 13))    
    return -- contacts incidents in monitoring projects does not generate incidents    

 end    

 -- only register incident if it has due date          
 if(@due_date is null)          
  return          
        
 -- only register incident if it has due time          
 if(CONVERT(TIME, @due_date) = '00:00:00.0000000')          
  return        
           
 -- only register incident if it does not exists yet and is not closed           
 if(exists(select 1 from incident where card_id = @card_id and cancelled = 0 and closed = 0))       
 begin      
  -- update incident schedule if it is not closed and not cancelled      
  update incident set date = @due_date where card_id = @card_id and cancelled = 0 and closed = 0      
      
  return          
 end          
        
          
 if(@location_id is null or @location_id = 1)      
  select @branch_id = branch_id from person where id = @leader_id          
 else      
  select @branch_id = id from branch where location_id = @location_id          
          
          select 'C'

 if(@incident_holder is not null)    
     exec RegisterNewIncident @type = @type, 
        @branch = @branch_id, @people = @incident_holder, @date = @due_date,   
        @responsible_id = @created_by, @card_id = @card_id, @register_closed = @register_closed          
          
end