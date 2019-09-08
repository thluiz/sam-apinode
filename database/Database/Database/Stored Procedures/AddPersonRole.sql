CREATE procedure [dbo].[AddPersonRole](@person_id int, @role_id int)              
as              
begin              
              
 if(exists(select 1 from person_role where role_id = @role_id and person_id = @person_id))              
  return;              
              
 insert into person_role (person_id, role_id)               
 values (@person_id, @role_id)               
              
 if(@role_id = 6)              
  update person set is_disciple = 1 where id = @person_id              
 else if (@role_id = 5)              
  update person set is_director = 1 where id = @person_id              
 else if (@role_id = 10)              
  update person set is_manager = 1 where id = @person_id              
 else if (@role_id = 1)              
 begin              
  delete from person_role where person_id = @person_id and role_id = 2              
  update person set is_active_member = 1, is_inactive_member = 0, is_interested = 0 where id = @person_id              
 end    
 else if (@role_id = 2)              
 begin              
  delete from person_role where person_id = @person_id and role_id in (1, 4)        
  update person set is_active_member = 0, is_leaving = 0, is_inactive_member = 1, is_interested = 0 where id = @person_id              
 end             
 else if (@role_id = 3)              
  update person set is_leaving = 1 where id = @person_id              
 else if (@role_id = 4)              
  update person set is_interested = 1 where id = @person_id              
 else if (@role_id = 11)              
  update person set is_operator = 1 where id = @person_id      
 else if (@role_id = 12)              
  update person set is_service_provider = 1 where id = @person_id        
 else if (@role_id = 13)              
  update person set is_associated_with_member = 1 where id = @person_id        
                
 exec UpdateP1ContractedSessions @person_id
 exec CheckPeopleStatus @person_id          
          
end 