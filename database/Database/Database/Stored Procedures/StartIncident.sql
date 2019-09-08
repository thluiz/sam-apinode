CREATE procedure [dbo].[StartIncident](            
 @incident int,            
 @responsible_id int = null            
)            
as             
begin            
          
  declare @card_id int, @ownership_id int, @incident_type int
            
  select @card_id = card_id, @ownership_id = ownership_id, @incident_type = incident_type
  from incident where id = @incident       
            
 update incident set started_on = getUTCdate(),           
 started_by = @responsible_id           
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
            
 select *     
 from vwLightIncident     
 where id = @incident      
 for json path    
      
end