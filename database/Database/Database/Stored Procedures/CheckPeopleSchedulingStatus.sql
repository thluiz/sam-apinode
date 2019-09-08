CREATE procedure CheckPeopleSchedulingStatus(@person int = null)    
as    
begin    
                              
 declare @people_scheduling_status table (person_id int, [status] int)                                    
                                    
 -- people without scheduled formal moment                                      
 insert into @people_scheduling_status(person_id, [status])                                    
  select p.id, 1                                    
  from person p                                    
  where p.id = isnull(@person, p.id)                     
 and (p.is_active_member = 1 or p.is_leaving = 1 or p.is_inactive_member = 1)                                       
 and p.id not in (select distinct pic.person_id from person_incident pic                                     
       join incident i on pic.incident_id = i.id                                    
       where (      
    (i.incident_type = 1)      
    or (p.program_id = 1 and i.incident_type = 10)      
    or (p.program_id = 2 and i.incident_type = 11)      
    or (p.program_id = 3 and i.incident_type = 12)      
   )                                
   and i.cancelled = 0                         
   and i.date > getUTCdate()                                    
       )        
	   
 -- interested people without scheduled event                                  
 insert into @people_scheduling_status(person_id, [status])                                    
  select p.id, 1                                    
  from person p                                    
  where p.id = isnull(@person, p.id)                     
 and (p.is_interested= 1)                                       
 and p.id not in (select distinct pic.person_id from person_incident pic                                     
       join incident i on pic.incident_id = i.id                                    
       where i.incident_type in (1, 10, 11, 29, 25 )                              
			and i.cancelled = 0                         
			and i.date > getUTCdate()                                    
       )	                                                     
                              
 -- people with absence in old obrigatory events that are not contacts            
 insert into @people_scheduling_status(person_id, [status])                        
  select p.Id, 2                                    
  from person p                                  
  where p.id = isnull(@person, p.id)                
  and (p.is_active_member = 1 or p.is_leaving = 1 or p.is_inactive_member = 1)                                            
  and p.id in (select distinct pic.person_id from person_incident pic                                     
       join incident i on pic.incident_id = i.id              
    join enum_incident_type eit on eit.id = i.incident_type                                                        
       where  eit.obrigatory = 1            
  and eit.financial_type <= 0            
  and eit.id != 5              
  and pic.person_id = isnull(@person, p.id)          
        and i.closed = 0                                    
        and i.treated = 0     
  and i.started_on is null                               
  and i.cancelled = 0                                
        and i.date < dbo.getCurrentDateTime()                                    
  )                                                                   
                        
 update ps set [status] = 4                                  
 from @people_scheduling_status ps                                 
 where exists(select 1 from person ps2 where ps.person_id = ps2.id and [status] = 1)                                    
  and exists(select 1 from person ps2 where ps.person_id = ps2.id and [status] = 2)                                    
  and ps.person_id = isnull(@person, ps.person_id)        
                                                        
 update p set scheduling_status = pfs.[status]                                    
 from person p                                     
  join @people_scheduling_status pfs on pfs.person_id = p.id    
  where p.scheduling_status != pfs.[status]    
                                                        
 update p set scheduling_status = 0                                    
 from person p                                     
 where not exists(select 1 from @people_scheduling_status pfs where pfs.person_id = p.id)                                    
 and p.id = isnull(@person, p.id)     
 and p.scheduling_status != 0                                     
                                                        
 update p set scheduling_status = 0                                 
 from person p                                
 where free_scheduling = 1                                
  and p.Id = isnull(@person, p.id)    
  and scheduling_status != 0     
    
end