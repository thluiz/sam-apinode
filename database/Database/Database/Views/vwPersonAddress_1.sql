CREATE view vwPersonAddress    
as    
select pa.id,     
  c.id country_id, c.name country,    
  pa.person_id, pa.principal, pa.[description], pa.name, pa.archived,    
  a.id address_id, a.postal_code, a.street, a.district, a.[state], a.number, a.complement,    
  case when len(a.street) > 0 then a.street else '' end 
  + isnull(' ' + a.number, '')   
  + isnull(', ' + a.complement, '') 
  + case when len(isnull(a.street, '')) > 0 or len(isnull(a.number, '')) > 0 or len(isnull(a.complement, '')) > 0 then ' - ' else '' end  
  + isnull(a.district, '')  
  + case when LEN(isnull(a.city, '')) > 0 then ', ' + a.city else  '' end
  + case when LEN(ISNULL(a.postal_code, '')) > 0 then ' - CEP: ' + a.postal_code else '' end
  long_description      
from person_address pa (nolock) 
 left join [address] a (nolock) on a.id = pa.address_id    
 left join country c (nolock) on c.id = a.country_id