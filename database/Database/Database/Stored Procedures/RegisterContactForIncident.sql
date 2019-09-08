CREATE procedure RegisterContactForIncident(@incident int, @contact varchar(max), @responsible_id int)        
as        
begin         
 declare @person int        
        
 update incident set treated = 1 where id = @incident
        
 if(exists(select 1 from incident_treatment where incident_id = @incident))   
 return   
  
 insert into incident_treatment(person_id, treatment_type, [description], incident_id)      
 values (      
	@responsible_id, 2, @contact, @incident     
 )     
      	  	
 select @person = pic.person_id      
 from incident i      
  join  person_incident pic on pic.incident_id = i.id      
 where i.id = @incident           
      
 exec CheckPeopleStatus @person        

 select * from vwLightIncident i
 where i.id = @incident
 for json path
        
end