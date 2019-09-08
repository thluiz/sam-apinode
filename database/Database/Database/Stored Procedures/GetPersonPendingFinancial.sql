CREATE procedure GetPersonPendingFinancial(      
 @person_id int      
)      
as      
begin      
   
   declare @without_schedule_payments bit = (select case when not exists(
												select distinct pic.person_id from person_incident pic                           
													join incident i on pic.incident_id = i.id                          
												where i.incident_type = 24                       
													and i.cancelled = 0  
													and i.treated = 0
													and pic.person_id = @person_id                       
													and i.date > getUTCdate()                          
												) then 1 else 0 end)             
      
select        
 (select * from vwPerson where id = @person_id for json path) person,  
 @without_schedule_payments without_schedule_payments,    
 (select i.*      
  from vwIncident i      
   join person_incident pic on pic.incident_id = i.id      
  where treated = 0       
   and i.closed = 0       
   and i.cancelled = 0       
   and pic.person_id = @person_id      
   and i.[full_date] < dbo.getCurrentDateTime()      
   and financial_type > 0  
  order by i.full_date desc    
 for json path      
 ) incidents        
 for json path, root('pending')      
           
end