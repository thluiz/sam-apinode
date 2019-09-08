               
          
CREATE procedure [dbo].GetExternalContacts(              
 @branch_id int = null,            
 @voucher_id int = null,          
 @name varchar(150) = null,  
 @voucher_status int = null,                     
 @people_per_page int = 50,                  
 @page int = 1                 
)              
as              
begin              
    if(@people_per_page is null)             
        set @people_per_page = (select count(1) from person where is_interested = 1)            
            
    if(@page is null or @page < 0)             
        set @page = 1            
          
    select p.*, isnull(cs.name, 'À definir') current_step, pr.monitoring_card_id, pr.identifier relationship_identifier,
        ni.id nit_id, ni.date next_incident_date, ni.incident_type next_incident_type_id, 
         isnull(lnit.abrev, '') + nit.Abrev next_incident_type_abrev,  
         li.id lit_id, li.date last_incident_date, li.incident_type last_incident_type_id, 
         isnull(pnit.abrev, '') + lit.Abrev last_incident_type_abrev,            
        (            
        select * from person_comment pc             
        where pc.person_id = p.id and pc.archived = 0             
        for json path            
        ) commentaries, isnull(c.[order], -1) voucher_status            
    from vwPerson p  (nolock)            
        left join incident i (nolock)  on i.id = p.next_incident_id      
        left join person_relationship pr (nolock)  on pr.person2_id = p.id      
        left join [card] c (nolock) on c.id = pr.monitoring_card_id      
        left join [card_step] cs (nolock)  on cs.id = c.current_step_id   
        left join incident ni (nolock) on ni.id = p.next_incident_id      
        left join enum_incident_type nit (nolock) on nit.id = ni.incident_type
        left join enum_incident_type pnit (nolock) on pnit.id = nit.parent_id
        left join incident li (nolock) on li.id = p.last_incident_id      
        left join enum_incident_type lit (nolock) on lit.id = li.incident_type
        left join enum_incident_type lnit (nolock) on lnit.id = lit.parent_id          
    where p.is_interested = 1           
        and (          
            exists(select 1           
            from person_voucher pv           
            where pv.person_id = p.id           
            and pv.voucher_id = ISNULL(@voucher_id, pv.voucher_id))          
            or  ((@voucher_id is null or @voucher_id = 18) and exists (          
            select 1 from person_relationship where person2_id = p.id and relationship_type in (10, 13, 14)))         
        )          
      and isnull(p.branch_id, -1) = isnull(@branch_id, isnull(p.branch_id, -1))            
      and (@name is null or len(@name) <= 0 or (p.name like '%' + @name + '%' COLLATE Latin1_General_CI_AI ))          
      and isnull(cs.[order], -1) = isnull(@voucher_status, isnull(cs.[order], -1))     
    ORDER BY isnull(i.date, dateadd(year, -1, getUTCdate())), name                 
    OFFSET ((@page - 1) * @people_per_page) ROWS                  
    FETCH NEXT @people_per_page ROWS ONLY                  
    for json path               
              
end