      
CREATE procedure [dbo].[GetPeopleAway](      
 @branch int = null,    
 @name varchar(150) = null,    
 @people_per_page int = 50,          
 @page int = 1         
)      
as      
begin      
  if(@people_per_page is null)     
 set @people_per_page = 3000    
    
  if(@page is null)     
 set @page = 1    
    
 if(not exists(select 1 from vwPerson p      
  left join incident i on i.id = p.next_incident_id      
  where  (p.is_leaving = 1 or is_inactive_member = 1)    
 and isnull(p.branch_id, -1) = isnull(@branch, isnull(p.branch_id, -1))    
 and (@name is null or len(@name) <= 0 or (p.name like '%' + @name + '%' COLLATE Latin1_General_CI_AI ))))          
 begin           
  select CAST(1 as bit) [empty]          
  for json path      
  return          
 end          
    
    
 select p.*, 
 ni.id nit_id, ni.date next_incident_date, ni.incident_type next_incident_type_id, 
 isnull(lnit.abrev, '') + nit.Abrev next_incident_type_abrev,  
 li.id lit_id, li.date last_incident_date, li.incident_type last_incident_type_id, 
 isnull(pnit.abrev, '') + lit.Abrev last_incident_type_abrev, 
 (    
 select * from person_comment pc     
 where pc.person_id = p.id and pc.archived = 0     
 for json path    
 ) commentaries    
  from vwPerson p (nolock)    
    left join incident ni (nolock) on ni.id = p.next_incident_id      
    left join enum_incident_type nit (nolock) on nit.id = ni.incident_type
    left join enum_incident_type pnit (nolock) on pnit.id = nit.parent_id
    left join incident li (nolock) on li.id = p.last_incident_id      
    left join enum_incident_type lit (nolock) on lit.id = li.incident_type
    left join enum_incident_type lnit (nolock) on lnit.id = lit.parent_id
  where p.id in (
      select p2.id 
      from person p2
        left join incident ni2 (nolock) on ni2.id = p2.next_incident_id
      where (p2.is_leaving = 1 or p2.is_inactive_member = 1)      
      and isnull(p2.branch_id, -1) = isnull(@branch, isnull(p2.branch_id, -1))    
      and (@name is null or len(@name) <= 0 or (p2.name like '%' + @name + '%' COLLATE Latin1_General_CI_AI ))    
      ORDER BY isnull(ni2.date, dateadd(year, -1, getUTCdate())), name         
      OFFSET ((@page - 1) * @people_per_page) ROWS          
      FETCH NEXT @people_per_page ROWS ONLY  
  )          
  for json path       
      
end    
  