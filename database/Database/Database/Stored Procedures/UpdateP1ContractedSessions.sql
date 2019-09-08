CREATE procedure UpdateP1ContractedSessions(@person_id int = null)  
as  
begin  
  
 update p set contracted_p1_sessions = case when d.[sessions] = 0 then 30 else d.[sessions] end  
 from person p  
  join program pr on pr.id = p.program_id  
  join domain d on d.id = p.domain_id  
 where p.is_active_member = 1  
  and p.program_id = 1  
  and p.contracted_p1_sessions != case when d.[sessions] = 0 then 30 else d.[sessions] end  
  and p.id = isnull(@person_id, p.id)  
  
 update p set contracted_p1_sessions = 0  
 from person p  
  join program pr on pr.id = p.program_id  
  join domain d on d.id = p.domain_id  
 where (p.is_active_member != 1 or p.program_id != 1)  
  and p.contracted_p1_sessions != 0  
  and p.id = isnull(@person_id, p.id)  
  
   
  
end