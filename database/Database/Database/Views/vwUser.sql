CREATE view vwUser    
as    
select u.id, u.email, u.login_provider_id, u.person_id,     
 u.token, isnull(pa.alias, p.name) [name],    
 p.avatar_img, p.branch_id,     
 p.comunication_status,  p.comunication_description,    
 p.data_status, p.data_status_description,    
 p.financial_status, p.is_director, p.is_disciple,     
 p.is_manager, p.is_operator, u.default_branch_id, 
 p.default_page_id, [page].[name] default_page, [page].[url] as default_page_url     
from [user] u    
 join person p on p.id = u.person_id    
 left join person_alias pa on pa.person_id = p.id and principal = 1 
 left join [url] as [page] on [page].id = p.default_page_id 