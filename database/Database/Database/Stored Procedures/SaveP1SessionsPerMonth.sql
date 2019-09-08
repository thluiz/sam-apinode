CREATE procedure [dbo].[SaveP1SessionsPerMonth](@person_id int = null)  
as  
begin   
 declare @start_date date = datefromparts(datepart(year, getUTCdate()), datepart(month, getUTCdate()), 1)  
 declare @end_date date = dateadd(d, -1, dateadd(month, 1, @start_date))  
   
 update p2 set p2.p1_sessions_current_month = total.[sessions]  
 from person p2  
 join   
  (select count(1) [sessions], pic.person_id  
  from incident i  
   join person_incident pic on pic.incident_id = i.id  
   join person p on p.id = pic.person_id  
  where i.incident_type = 10  
   and i.closed = 1  
   and i.treated = 0  
   and cast(date as date) between datefromparts(datepart(year, getUTCdate()), datepart(month, getUTCdate()), isnull(datepart(day, enrollment_date), 1)) 
								and dateadd(month, 1, datefromparts(datepart(year, getUTCdate()), datepart(month, getUTCdate()), isnull(datepart(day, enrollment_date), 1)))
   and p.program_id = 1    
   and pic.person_id = isnull(@person_id, pic.person_id)  
  group by pic.person_id) total on total.person_id = p2.id  
 where p2.p1_sessions_current_month != total.[sessions]  
        
  
end  
  

  select datepart(day, null)