CREATE procedure [dbo].[UpdatePersonData](                        
 @id int,                        
 @name varchar(200),                        
 @birth_date date,                        
 @admission_date date,                        
 @enrollment_date date,                        
 @baaisi_date date,                        
 @kf_name varchar(200),          
 @identification varchar(50),          
 @identification2 varchar(50),          
 @passport varchar(50),          
 @passport_expiration_date date,          
 @occupation varchar(100),          
 @kf_name_ideograms NVarchar(200),                      
 @family_id int,                    
 @branch_id int,                    
 @program_id int,                    
 @domain_id int,        
 @destiny_family_id int,     
 @alias varchar(300) = null ,  
 @gender varchar(1) = null,  
 @shirt_size varchar(3) = null,    
 @pants_size varchar(3) = null  
) as                        
begin                         
 if(@kf_name is not null)                        
 begin                        
  delete from person_alias where person_id = @id and kungfu_name = 1                              
                        
  insert into person_alias(person_id, alias, kungfu_name, ideograms)                              
   values(@id, @kf_name, 1, @kf_name_ideograms)                              
 end       
    
 if(@alias is not null and len(@alias) > 0)    
 begin     
 delete from person_alias where person_id = @id and principal = 1    
                        
 insert into person_alias(person_id, alias, principal)                              
  values(@id, left(@alias, 15), 1)                              
 end    
    
 declare @original_branch int      
       
 select @original_branch = branch_id       
 from person       
 where id = @id                      
                        
 update person set [name] = @name,                        
  birth_date = @birth_date,                  
  admission_date = @admission_date,                        
  baaisi_date = @baaisi_date,                  
  family_id = @family_id, branch_id = @branch_id,                     
  program_id = @program_id, domain_id = @domain_id,            
  enrollment_date = @enrollment_date,          
  identification = @identification,           
  identification2 = @identification2,           
  occupation = @occupation,          
  passport = @passport,          
  passport_expiration_date = @passport_expiration_date,        
  destiny_family_id = @destiny_family_id,     
  alias = case when len(@alias) > 0 and @alias is not null then left(@alias, 15) else null end,     
  updated_at = getUTCdate() ,  
  gender = @gender,  
  shirt_size = @shirt_size,  
  pants_size = @pants_size   
 where id = @id             
       
 if(@original_branch != @branch_id       
 and exists(select 1       
    from person_relationship pr       
     join person p on p.id = pr.person2_id      
    where pr.person2_id = @id       
     and pr.monitoring_card_id > 0      
     and p.is_interested = 1))      
  begin      
 declare @new_parent_monitoring_project int, @new_step int      
      
 select @new_parent_monitoring_project = c.id       
 from card c      
  join branch b on b.location_id = c.location_id      
 where c.card_template_id = 11      
  and b.id = @branch_id      
       
 select @new_step = new_cs.id      
 from card c      
  join person_relationship pr on pr.monitoring_card_id = c.id      
  join card_step cs on cs.id = c.current_step_id      
  join card_step new_cs on new_cs.[order] = cs.[order] and new_cs.card_id = @new_parent_monitoring_project      
 where pr.person2_id = @id      
      
 update c set parent_id = @new_parent_monitoring_project, current_step_id = @new_step      
 from card c      
  join person_relationship pr on pr.monitoring_card_id = c.id      
 where pr.person2_id = @id      
      
      
  end               
      
        
 exec UpdateP1ContractedSessions @id                 
 exec CheckPeopleStatus @id                
              
 exec GetPersonData @id              
                         
end