                                                          
CREATE procedure [dbo].[GetAgenda2](    
 @branch_id int = null,                                                                      
 @date date = null              
)                                                                                            
as                                                                                            
begin                
 -- declare @branch_id int, @display_modifier int = 0                
                                
 if(@date is null)              
  set @date = dbo.getCurrentDate()              
                                
 select DATEPART(HOUR, i.date) schedule_group,    
   (select i2.*    
  from vwLightIncident i2    
  where i2.id in (
    select i3.id 
    from incident i3 (nolock) 
        join enum_incident_type eit (nolock) on eit.id = i3.incident_type
    where i3.cancelled = 0                
        and i3.branch_id = ISNULL(@branch_id, i3.branch_id)                
        and cast(i3.[date] as date) = @date             
        and eit.need_start_hour_minute = 1             
        and DATEPART(HOUR, i3.date) = DATEPART(HOUR, i.date)    
  )      
  order by DATEPART(HOUR, i2.date),          
    case when i2.[incident_type] = 36 then 0 else 1 end,   
    i2.incident_type,  
    DATEPART(Minute, i2.date),      
    isnull(i2.started_on, i2.date), i2.person                
  for json path                  
 ) incidents                 
 from incident i (nolock)    
    join enum_incident_type eit (nolock) on eit.id = i.incident_type    
 where i.cancelled = 0                
    and i.branch_id = ISNULL(@branch_id, i.branch_id)                
    and cast(i.[date] as date) = @date                
    and eit.need_start_hour_minute = 1             
 group by DATEPART(HOUR, i.date)          
 order by DATEPART(HOUR, i.date)          
 for json path                                                                                           
                
end