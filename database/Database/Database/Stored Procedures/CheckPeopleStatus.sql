CREATE procedure [dbo].[CheckPeopleStatus](@person int = null)                                
as                                
begin                                                                  
            
  exec GetPersonMissingData @person_id = @person, @save_data = 1                    
                                       
 update p set p.has_birthday_this_month = 1              
 from person p              
 where DATEPART(MONTH, birth_date) = DATEPART(MONTH, dbo.getCurrentDateTime())              
 and p.Id = isnull(@person, p.id)                    
 and p.has_birthday_this_month = 0                 
              
 update p set p.has_birthday_this_month = 0              
 from person p              
 where DATEPART(MONTH, birth_date) != DATEPART(MONTH, dbo.getCurrentDateTime())              
 and p.Id = isnull(@person, p.id)                    
 and p.has_birthday_this_month = 1                                  
            
                    
end 

