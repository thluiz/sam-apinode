                                                                        
CREATE procedure [dbo].[GetAgenda3](                  
 @branch_id int = null,               
 @location_it int  = null,                                                                                   
 @date date = null                   
)                                                                                                          
as                                                                                                          
begin                              
 -- declare @branch_id int, @display_modifier int = 0                         
                                              
 if(@date is null)                            
  set @date = cast(getUTCdate() as date)      
      
  declare @ownerships table(id int)    
    
  insert into @ownerships    
      select i.id         
        from incident i (nolock)                       
      where incident_type = 36              
            and cancelled = 0                   
            and cast(date as date) = @date            
            and (i.branch_id is null or  i.branch_id = isnull(@branch_id, i.branch_id))          
                
  select                                             
    (select *       
    from vwLightIncident l        
    where l.id in (select id from @ownerships)              
 order by l.treated desc, l.closed, isnull(dateadd(hour, l.gmt, l.started_on),  l.date)           
 for json path) ownerships,                     
 (select *              
 from vwLightIncident               
 where id in (              
     select i2.id               
     from incident i2 (nolock)              
     where i2.incident_type != 36              
        and i2.cancelled = 0                                 
        and (i2.branch_id is null or i2.branch_id = isnull(@branch_id, i2.branch_id))      
        and cast(date as date) = @date)              
  for json path              
 ) incidents,    
 (select ia.*, iai.incident_id  
    from vwIncidentAction ia (nolock)    
        join incident_action_incident iai (nolock) on iai.incident_action_id = ia.id    
    where ia.cancelled = 0    
        and iai.incident_id in (select id from @ownerships)            
    order by ia.created_at    
 for json path) actions    
 for json path                             
end