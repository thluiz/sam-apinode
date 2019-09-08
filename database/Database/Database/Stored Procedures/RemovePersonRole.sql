CREATE procedure [dbo].[RemovePersonRole](@person_id int, @role_id int)    
as    
begin    
    
 delete from person_role where role_id = @role_id and person_id = @person_id    
    
 if(@role_id = 6)    
  update person set is_disciple = 0 where id = @person_id    
 else if (@role_id = 5)    
  update person set is_director = 0 where id = @person_id    
 else if (@role_id = 10)    
  update person set is_manager = 0 where id = @person_id   
 else if (@role_id = 1)    
  update person set is_active_member = 0 where id = @person_id    
 else if (@role_id = 3)    
  update person set is_leaving = 0 where id = @person_id     
 else if (@role_id = 4)    
  update person set is_interested = 0 where id = @person_id  
 else if (@role_id = 11)        
  update person set is_operator = 0 where id = @person_id  
 else if (@role_id = 12)        
  update person set is_service_provider = 0 where id = @person_id  
 else if (@role_id = 13)        
  update person set is_associated_with_member = 0 where id = @person_id  
  
 exec UpdateP1ContractedSessions @person_id  
 exec CheckPeopleStatus @person_id    
    
end    