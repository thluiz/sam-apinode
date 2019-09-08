CREATE view vwFamily    
as    
 select family.id id, pa.alias [name], 'F' + dbo.GetAbreviation(pa.alias) abrev, 'Familía ' + pa.alias full_name  
  from person family     
   join person_role pr on pr.person_id = family.id      
   join person_alias pa on pa.person_id = family.id      
  where pr.role_id = 9    
   and pa.kungfu_name = 1 