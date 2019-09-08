           
      
CREATE procedure [dbo].[GetInvitedPeople](          
 @branch int = null,        
 @voucher int = null,      
 @name varchar(150) = null,        
 @people_per_page int = 50,              
 @page int = 1             
)          
as          
begin          
  if(@people_per_page is null)         
 set @people_per_page = 300        
        
  if(@page is null)         
 set @page = 1        
        
 if(not exists(select 1 from vwPerson p        
 left join person_voucher pv on pv.person_id = p.id               
  where p.is_interested = 1          
 and (exists(select 1       
    from person_voucher pv       
    where pv.person_id = p.id       
     and pv.voucher_id = ISNULL(@voucher, pv.voucher_id))      
 or  ((@voucher is null or @voucher = 1) and exists (      
  select 1 from person_relationship where person2_id = p.id and relationship_type in (10, 13)          
  )))      
 and isnull(p.branch_id, -1) = isnull(@branch, isnull(p.branch_id, -1))         
 and (@name is null or len(@name) <= 0 or (p.name like '%' + @name + '%' COLLATE Latin1_General_CI_AI ))))              
 begin               
  select CAST(1 as bit) [empty]              
  for json path          
  return              
 end              
        
    
 select p.*, isnull(cs.name, 'À definir') current_step, pr.monitoring_card_id, pr.identifier relationship_identifier,       
 (        
  select * from person_comment pc         
  where pc.person_id = p.id and pc.archived = 0         
  for json path        
 ) commentaries        
  from vwPerson p  (nolock)        
  left join incident i (nolock)  on i.id = p.next_incident_id  
  left join person_relationship pr (nolock)  on pr.person2_id = p.id  
  left join [card] c (nolock) on c.id = pr.monitoring_card_id  
  left join [card_step] cs (nolock)  on cs.id = c.current_step_id         
  where p.is_interested = 1       
 and (      
  exists(select 1       
   from person_voucher pv       
   where pv.person_id = p.id       
    and pv.voucher_id = ISNULL(@voucher, pv.voucher_id))      
 or  ((@voucher is null or @voucher = 1) and exists (      
  select 1 from person_relationship where person2_id = p.id and relationship_type in (10, 13)          
 ))     
 )      
  and isnull(p.branch_id, -1) = isnull(@branch, isnull(p.branch_id, -1))        
  and (@name is null or len(@name) <= 0 or (p.name like '%' + @name + '%' COLLATE Latin1_General_CI_AI ))        
 ORDER BY isnull(i.date, dateadd(year, -1, getUTCdate())), name             
 OFFSET ((@page - 1) * @people_per_page) ROWS              
 FETCH NEXT @people_per_page ROWS ONLY              
  for json path           
          
end