CREATE procedure GetPersonRoles(    
 @person_id int    
)    
as    
begin     
    
 if(not exists(select 1 from person_role where person_id = @person_id))    
 begin     
  select CAST(1 as bit) [empty]    
  for json path
  return    
 end    
    
 select r.*     
 from [role] r    
  join person_role pr on pr.role_id = r.id    
 where pr.person_id = @person_id    
 order by r.[name]  
 for json path     
      
    
end    