CREATE procedure GetRoles  
as  
begin  
  
 select * from [role]  
 order by [name]
 for json path  
  
end