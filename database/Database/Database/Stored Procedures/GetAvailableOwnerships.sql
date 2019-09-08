CREATE procedure [dbo].[GetAvailableOwnerships](@branch_id int, @date datetime, @type int)    
as    
begin    
     
 -- declare @date datetime = '2018-07-19 10:00', @branch_id int = 1, @type int = 23    
    
 select * from vwIncident where id in (    
  select i.id     
  from incident i    
   left join ownership_incident_type tp on tp.incident_id = i.id    
  where i.incident_type = 36    
   and treated = 0    
   and closed = 0    
   and cancelled = 0    
   and closed_on is null    
   and branch_id = @branch_id    
   and (tp.id is null or tp.incident_type = @type)    
   and (    
    (cast(date as date) = cast(@date as date)) -- ownerships of sameday    
    and date <= @date -- ownerships before date  
    and (end_date is null  or end_date >= @date ) -- ownership without close date or ownership that close after date  
   )    
  )    
 for json path    
      
    
     
     
end