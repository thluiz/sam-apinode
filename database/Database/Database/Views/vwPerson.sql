-- drop view vwPerson                                                        
        
CREATE view vwPerson                                                        
 with schemabinding                                                
 as                                                        
 select p.id, b.[abrev] branch_abrev, b.id branch_id,                                                                                                          
   d.abrev [domain], d.[order] domain_order, d.id [domain_id],                                                                                                                          
   isnull(pa.alias, p.[name]) [name],                                                         
   p.[name] [full_name],        
   p.alias,        
   p.financial_status, p.scheduling_status,                                                                                                                        
   pfs.[description] [financial_description],                                                                                                                        
   pss.[description] [scheduling_description],                                                                                                                      
   avatar_img, avatar_sm, avatar_md, avatar_esm, d.program_id,  
   comunication_status, comunication_description,                                                                                                             
   kfname.alias kf_name, p.admission_date, p.birth_date,                                                                          
   kfname.ideograms kf_name_ideograms, b.initials branch_initials,                                                                
   paf.initials family_abrev, paf.alias family_name, paf.person_id family_id,                                             
   destiny_family.initials destiny_family_abrev, destiny_family.alias destiny_family_name, destiny_family.person_id destiny_family_id,                                             
   is_active_member, is_disciple, is_leaving, is_inactive_member,                                                        
   b.active branch_active, p.data_status, p.data_status_description,                                                    
   p.issues_level, p.has_birthday_this_month,      
   p.offering_status, p.offering_status_description,                                              
   p.baaisi_date, CONVERT (VARCHAR, p.baaisi_date, 103) baaisi_date_br,                                                            
   CONVERT (VARCHAR, p.birth_date, 103) birth_date_br,                                                            
   CONVERT (VARCHAR, p.admission_date, 103) admission_date_br,                                              
   pr.long_name [program_name], d.long_name domain_name, p.updated_at,                                    
   p.enrollment_date,                                    
   CONVERT (VARCHAR, p.enrollment_date, 103) enrollment_date_br,                                
   CONVERT (VARCHAR, p.passport_expiration_date, 103) passport_expiration_date_br,                                
   p.identification, p.identification2, p.passport, p.occupation,                                
   p.passport_expiration_date, CAST(DATEDIFF(hh, [birth_date], getUTCdate()) / 8766 AS int) age,                              
   p.is_interested, p.next_incident_id, p.last_incident_id, p.is_service_provider,                        
   p.is_operator, p.is_manager, p.is_director, p.is_associated_with_member, p.is_external_member,                    
   p.p1_sessions_current_month, p.contracted_p1_sessions,             
   p.gender, p.shirt_size, p.pants_size,  
   (select contact, principal, details, icon, base_url                        
  from dbo.vwPersonContact pc (nolock)                   
  where pc.person_id = p.id                    
   and removed = 0                      
    for json path                     
   ) contacts,              
   (select pv.id, v.initials voucher_initials, v.title voucher,               
  bm.base_description schedule, pv.branch_map_id                
   from dbo.person_voucher pv (nolock)              
 join dbo.voucher v  (nolock) on pv.voucher_id = v.id               
 join dbo.branch_map bm  (nolock) on bm.id = pv.branch_map_id               
 where pv.person_id = p.id              
 for json path) vouchers,        
 p.pinned_comment_count,        
 (select pc.comment from dbo.person_comment pc (nolock) where pc.person_id = p.id and pc.pinned = 1 for json path)  pinned_comments                                   
 from dbo.person p  (nolock)                                                                                        
 left join dbo.program pr (nolock)  on pr.id = p.program_id                                                                                       
  left join dbo.domain d  (nolock) on d.id = p.domain_id                                                                                                         
  left join dbo.branch b  (nolock) on b.id = p.branch_id                                                                                
  left join dbo.enum_person_financial_status pfs (nolock)  on pfs.id = p.financial_status                                                                                                                        
  left join dbo.enum_person_scheduling_status pss (nolock)  on pss.id = p.scheduling_status                                                                                
  left join dbo.person_alias pa (nolock)  on p.id = pa.person_id and pa.principal = 1                                                                                                                            
  left join dbo.person_alias kfname (nolock)  on p.id = kfname.person_id and kfname.kungfu_name = 1                                                                                                                               
  left join dbo.person_alias paf (nolock)  on paf.person_id = p.family_id and paf.kungfu_name = 1                                   
  left join dbo.person_alias destiny_family (nolock)  on destiny_family.person_id = p.destiny_family_id and destiny_family.kungfu_name = 1   