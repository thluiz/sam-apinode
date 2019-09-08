CREATE procedure [dbo].[GetMembersList]      
as      
begin      
      
 select id, [long_name],       
  (select d.*,      
   (select pp.id, pp.avatar_img, pp.admission_date, convert(varchar, pp.admission_date, 103) admission_date_br,      
    pp.financial_status, pp.scheduling_status, pp.is_leaving, pp.is_inactive_member,      
    ISNULL(pa.alias, pp.[name]) [name], kf_name.ideograms kf_name_ideograms, kf_name.alias kf_name,      
    b.[abrev] branch, family.abrev family_name, b.initials branch_initials,    
 pp.data_status, pp.data_status_description,     
 epss.[description] scheduling_description, epfs.[description] financial_description, pp.has_birthday_this_month,
 pp.p1_sessions_current_month, pp.contracted_p1_sessions, pp.program_id     
   from person pp       
  join branch b on b.id = pp.branch_id     
  join enum_person_scheduling_status epss on epss.id = pp.scheduling_status     
  join enum_person_financial_status epfs on epfs.id = pp.financial_status    
  left join person_alias pa on pa.person_id = pp.id and pa.principal = 1      
  left join person_alias kf_name on kf_name.person_id = pp.id and kf_name.kungfu_name = 1      
  left join vwFamily family on family.id = pp.family_id          
   where pp.program_id = p.id      
    and pp.domain_id = d.id      
    and b.active = 1      
 and pp.is_active_member = 1  
   order by pp.admission_date, pp.birth_date, pp.[name]      
   for json path      
   ) members       
  from domain d (nolock)      
  where d.program_id = p.id         
   and exists(select 1 from person ps where ps.domain_id = d.id)      
  order by [order]      
  for json path) [domains]      
 from program p  (nolock)      
 order by id desc      
 for json path       
      
end  
  
