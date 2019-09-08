        --[GetPersonMissingData] @save_data = 1    
CREATE procedure [dbo].[GetPersonMissingData](@person_id int = null, @save_data bit = 0)                    
as                    
begin                    
                    
  declare @data_status_description table (person_id int, [description] varchar(100), missing_code varchar(30))                                                   
          
  insert into @data_status_description(person_id, [description], missing_code)                            
  select id, 'Sem Núcleo Vinculado', 'NO_BRANCH_DEFINED'                            
  from person p                              
  where branch_id is null                            
   and (p.is_active_member = 1 or p.is_leaving = 1 or p.is_interested = 1 or is_service_provider = 1)                            
   and p.Id = isnull(@person_id, p.id)               
                            
  insert into @data_status_description(person_id, [description], missing_code)                            
  select id, 'Sem data de nascimento', 'NO_BIRTH_DATE'                            
  from person p                              
  where birth_date is null                            
   and (p.is_active_member = 1 or p.is_leaving = 1 or p.is_inactive_member = 1 or is_interested = 1)                            
   and p.Id = isnull(@person_id, p.id)                  
                               
                            
  insert into @data_status_description(person_id, [description], missing_code)                            
  select id, 'Sem data de admissão', 'NO_ADMISSION_DATE'                            
  from person p                              
  where admission_date is null                            
   and p.Id = isnull(@person_id, p.id)                            
   and (p.is_active_member = 1 or p.is_leaving = 1 or p.is_inactive_member = 1)                            
   and p.program_id >= 2                         
   and p.family_id is not null           
                     
 insert into @data_status_description(person_id, [description], missing_code)                            
  select id, 'Sem data de matrícula', 'NO_ENROLLMENT_DATE'                            
  from person p                              
  where enrollment_date is null                            
   and p.Id = isnull(@person_id, p.id)                            
   and (p.is_active_member = 1 or p.is_leaving = 1 or p.is_inactive_member = 1)                            
   and p.program_id is not null                   
   and p.destiny_family_id is not null                  
                
 insert into @data_status_description(person_id, [description], missing_code)                            
  select id, 'Sem identidade', 'NO_IDENTIFICATION'                            
  from person p                              
  where (identification is null or len(identification) <= 0)                            
   and p.Id = isnull(@person_id, p.id)                            
   and (p.is_active_member = 1 or p.is_leaving = 1 or p.is_inactive_member = 1)                
   and CAST(DATEDIFF(hh, [birth_date], getUTCdate()) / 8766 AS int) > 18                
                                    
 insert into @data_status_description(person_id, [description], missing_code)                            
  select id, 'Sem CPF', 'NO_IDENTIFICATION2'                            
  from person p                              
  where (identification2 is null or len(identification2) <= 0)                            
   and p.Id = isnull(@person_id, p.id)                            
   and (p.is_active_member = 1 or p.is_leaving = 1 or p.is_inactive_member = 1)                 
   and CAST(DATEDIFF(hh, [birth_date], getUTCdate()) / 8766 AS int) > 18                
                
 insert into @data_status_description(person_id, [description], missing_code)                         
  select id, 'Sem Profissão', 'NO_OCCUPATION'                            
  from person p                              
  where (occupation is null or len(occupation) <= 0)                           
   and p.Id = isnull(@person_id, p.id)                            
   and (p.is_active_member = 1 or p.is_leaving = 1 or p.is_inactive_member = 1)                
   and CAST(DATEDIFF(hh, [birth_date], getUTCdate()) / 8766 AS int) > 18                 
                  
 insert into @data_status_description(person_id, [description], missing_code)                            
  select id, 'Sem família de destino', 'NO_DESTINY_FAMILY'                            
  from person p                              
  where destiny_family_id is null                            
   and p.Id = isnull(@person_id, p.id)                            
   and (p.is_active_member = 1 or p.is_leaving = 1 or p.is_inactive_member = 1)                            
   and p.program_id is not null and p.id != 41                                 
                             
  insert into @data_status_description(person_id, [description], missing_code)                            
  select p.id, 'Sem ideogramas do nome kung fu', 'NO_KF_NAME_IDEOGRAMS'                           
  from person p                             
   join person_alias pa on pa.person_id = p.id and pa.kungfu_name = 1                            
  where p.Id = isnull(@person_id, p.id)                            
   and (p.is_disciple = 1 and (pa.ideograms is null or LEN(pa.ideograms) <= 1))                            
                            
  insert into @data_status_description(person_id, [description], missing_code)                            
  select p.id, 'Sem nome kung fu', 'NO_KF_NAME'                                   
  from person p                             
   left join person_alias pa on pa.person_id = p.id and pa.kungfu_name = 1                             
  where p.Id = isnull(@person_id, p.id)                            
   and p.is_disciple = 1                             
   and pa.alias is null        
   
  insert into @data_status_description(person_id, [description], missing_code)                            
  select p.id, 'Sem gênero definido', 'NO_GENDER_DEFINED'                                   
  from person p                                
  where p.Id = isnull(@person_id, p.id)                            
   and p.is_active_member = 1    
   and (p.gender is null or len(p.gender) = 0)                                                      
  
  insert into @data_status_description(person_id, [description], missing_code)                            
  select p.id, 'Sem tamanho de camisa definido', 'NO_SHIRT_SIZE_DEFINED'                                   
  from person p                                
  where p.Id = isnull(@person_id, p.id)                            
   and p.is_active_member = 1       
   and (p.shirt_size is null or len(p.shirt_size) = 0)
   
  insert into @data_status_description(person_id, [description], missing_code)                            
  select p.id, 'Sem tamanho de calça definido', 'NO_PANTS_SIZE_DEFINED'                                   
  from person p                                
  where p.Id = isnull(@person_id, p.id)                            
   and p.is_active_member = 1       
   and (p.pants_size is null or len(p.pants_size) = 0)                          
                      
  insert into @data_status_description(person_id, [description], missing_code)                            
  select p.id, 'Sem contato principal definido', 'NO_PRINCIPAL_CONTACT'                            
  from person p                               
  where p.Id = isnull(@person_id, p.id)                                              
  and not exists(select 1 from person_contact pc where pc.person_id = p.id and pc.principal = 1 and removed = 0)                    
  and exists(select 1 from person_contact pc where pc.person_id = p.id and removed = 0)                    
                            
  insert into @data_status_description(person_id, [description], missing_code)                            
  select p.id, 'Nenhum contato definido', 'NO_CONTACTS'                            
  from person p                               
  where p.Id = isnull(@person_id, p.id)                                              
  and not exists(select 1 from person_contact pc where pc.person_id = p.id and removed = 0)                    
                                    
                    
  if(@save_data = 1)                    
  begin                    
   update p set data_status = 1, data_status_description = stuff(                            
      (select ', ' + [description]             
   from @data_status_description                            
   where person_id = p.id                            
      For XML PATH ('')), 1, 2, ''                            
     )                            
   from person p                            
where                           
   p.id = ISNULL(@person_id, p.id)     
   and p.data_status != 1                       
   and exists(select 1 from @data_status_description d where d.person_id = p.id)                            
                          
   update p set data_status = 0, data_status_description = ''                                     
   from person p                                    
   where p.Id = isnull(@person_id, p.id)    
 and data_status != 0                       
 and not exists(select 1 from @data_status_description d where d.person_id = p.id)                    
 end                    
 else                    
 begin                    
  if(not exists(select 1 from @data_status_description))                    
  begin                    
   select CAST(1 as bit) [empty]                    
   for json path                    
                    
   return              end                    
                    
  select * from @data_status_description                    
  for json path                    
 end                    
end 