CREATE procedure [dbo].[ReopenIncident](@incident int, @responsible_id int = null)          
as          
begin          
 declare @card_id int      
 select @card_id = card_id from incident where id = @incident
  
 update i set i.closed = 0,           
  i.closed_on = null  
 from incident i        
 where id = @incident
   
 if(@card_id is not null)  
  begin  
  declare @doing_step int  
  select top 1 @doing_step = cs.id  
  from [card] c  
   join [card] parent on parent.id = c.parent_id  
   join [card_step] cs on cs.card_id = parent.id  
  where c.id = @card_id  
   and cs.start_incident = 1  
  
  exec SaveCardStep @card_id, @doing_step, @responsible_id, @load_card = 0  
  end         
          
  select * from vwLightIncident where id = @incident
  for json path

end    