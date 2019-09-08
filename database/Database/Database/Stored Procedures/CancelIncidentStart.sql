CREATE procedure [dbo].[CancelIncidentStart](      
 @incident int,  
 @responsible_id int = null    
)      
as       
begin      
  
 declare @card_id int   
    
 select @card_id = card_id from incident where id = @incident  
      
 update incident set started_on = null,     
 started_by = null     
 where id = @incident      
      
  if(@card_id is not null)  
  begin  
  declare @start_step int  
  select top 1 @start_step = cs.id  
  from [card] c  
   join [card] parent on parent.id = c.parent_id  
   join [card_step] cs on cs.card_id = parent.id  
  where c.id = @card_id  
   and cs.start_incident = 0  
   and cs.is_blocking_step = 0  
   and cs.is_closing_step = 0  
   and cs.need_action = 0  
   and cs.initial_step = 1  
  
  exec SaveCardStep @card_id, @start_step, @responsible_id, @load_card = 0 
  end  

  select * from vwLightIncident where id = @incident
  for json path
  
end

