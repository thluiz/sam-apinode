CREATE procedure [dbo].[RescheduleIncident](@incident int, @new_date varchar(16), 
@contact varchar(max) = null, @responsible_id int, @ownership_id int = null)            
as            
begin             
 declare @person int, @branch_id int, @location_id int
 
 select @branch_id  = branch_id, @location_id = location_id
 from incident 
 where id = @incident
            
 update incident set treated = 1 where id = @incident    
     
 if(exists(select 1 from incident_treatment where incident_id = @incident))     
  return
  
 if(@ownership_id is null)
 begin
    select top 1 @ownership_id = i.id     
    from incident i 
    where incident_type = 36
        and cancelled = 0
        and cast(date as date) = cast(@new_date as date)        
        and date <= @new_date
        and (end_date is null or end_date >= @new_date)
        and ((@location_id is null and i.branch_id = @branch_id)
                    or (@location_id is not null 
                        and (i.location_id = @location_id or i.branch_id = @branch_id)
                        )
                )
    order by date      
 end                 
            
 insert into incident(responsible_id, incident_type, date, closed, branch_id, [description],     
  [value], fund_value, person_schedule_id, ownership_id)            
 select @responsible_id, incident_type, cast(@new_date as datetime), closed, branch_id,     
  [description], [value], fund_value,    
  person_schedule_id, @ownership_id   
 from incident            
 where id = @incident        
          
 declare @new_incident_id int = @@IDENTITY        
        
 select @person = pic.person_id          
 from incident i          
  join  person_incident pic on pic.incident_id = i.id          
 where i.id = @incident          
        
 insert into person_incident(person_id, incident_id, participation_type)   
 values (        
  @person, @new_incident_id, 1        
 )        
                    
 insert into incident_treatment(person_id, treatment_type, incident_id, new_incident_id, [description])          
 values (          
  @responsible_id, 1, @incident, @new_incident_id, @contact      
 )            
            
 exec CheckPeopleStatus @person    
   
 select * from vwLightIncident where id in (@incident, @new_incident_id)  
 for json path          
            
end    
    