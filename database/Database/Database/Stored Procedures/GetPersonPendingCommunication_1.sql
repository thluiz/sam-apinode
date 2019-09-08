CREATE procedure [dbo].[GetPersonPendingCommunication](    
 @person_id int    
)    
as    
begin    
    
select      
 (select * from vwPerson where id = @person_id for json path) person,    
 (select i.*    
  from vwIncident i    
   join person_incident pic on pic.incident_id = i.id    
  where [type] = 5     
   and treated = 0     
   and i.closed = 0     
   and i.cancelled = 0     
   and pic.person_id = @person_id    
   and i.[full_date] < dbo.getCurrentDateTime()    
   order by i.full_date desc  
 for json path    
 ) incidents,    
    
 (select c2.*    
  from [vwCard] c2    
  where c2.id in (
  select c.id
  from [card] c
   join person_card pc on c.id = pc.card_id    
   join [card] parent on c.parent_id = parent.id    
   left join [card] grand_parent on parent.parent_id = grand_parent.id    
  where 
        c.closed = 0     
       and c.cancelled = 0    
       and c.archived = 0    
       and c.parent_archived = 0
       and pc.person_id = @person_id    
       and pc.position = 5    
   ) 
   order by c2.high_level_title, c2.parent_title, c2.title        
 for json path) communications    
 for json path, root('pending')    
         
end