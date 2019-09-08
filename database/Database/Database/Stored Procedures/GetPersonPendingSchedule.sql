CREATE procedure GetPersonPendingSchedule(    
 @person_id int    
)    
as    
begin    
    
   declare @without_future_schedule bit = (select case when not exists(
												select distinct pic.person_id from person_incident pic (nolock)                           
														join incident i  (nolock) on pic.incident_id = i.id    
														join enum_incident_type eit (nolock) on eit.id = i.incident_type                                              
												   where  eit.obrigatory = 1  
													and eit.financial_type <= 0  
													and eit.id != 5    
													and pic.person_id = isnull(@person_id, pic.person_id)
													and i.closed = 0                          
													and i.treated = 0                        
													and i.cancelled = 0                      
													and i.date > dbo.getCurrentDateTime()                            
												) then 1 else 0 end)   

select      
 (select * from vwPerson (nolock) where id = @person_id for json path) person,   
 @without_future_schedule without_schedule, 
 (select i.*    
  from vwIncident i  (nolock) 
   join person_incident pic (nolock) on pic.incident_id = i.id    
  where treated = 0     
   and i.closed = 0     
   and i.cancelled = 0     
   and pic.person_id = @person_id    
   and i.[full_date] < dbo.getCurrentDateTime()    
   and i.obrigatory = 1
   and financial_type <= 0
   and [type] != 5
   order by i.full_date desc  
 for json path    
 ) incidents      
 for json path, root('pending')    
         
end