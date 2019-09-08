        
CREATE procedure GetPersonIncidentHistory2(        
 @person_id int, @activity_type int, @start_date date, @end_date date      
)        
as        
begin        
        
 select *         
 from vwLightIncident        
 where id in (        
  SELECT i.id          
  FROM incident i (nolock)        
   join person_incident pic (nolock) on pic.incident_id = i.id         
   join enum_incident_type eit (nolock) on eit.id = i.incident_type        
  where cast(i.date as date) between @start_date and @end_date       
 and i.cancelled = 0         
 and pic.person_id = @person_id        
 and ((@activity_type is null or @activity_type > 0 and eit.activity_type = @activity_type)  
  or @activity_type is not null and @activity_type = - 1 and eit.activity_type not in (16, 17, 18))  
 )        
 order by date desc        
 for json path        
        
end