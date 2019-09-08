CREATE view vwPersonAddress  
as  
select pa.id,   
  c.id country_id, c.name country,  
  pa.person_id, pa.principal, pa.[description], pa.name, pa.archived,  
  a.id address_id, a.postal_code, a.street, a.district, a.[state], a.number, a.complement,  
  a.street + isnull(' ' + a.number, '') 
			+ isnull(', ' + a.complement, '') 
			+ isnull(' - ' + a.district, '')
			+ isnull(', ' + a.city, '')			
			+ isnull(' - CEP: ' + a.postal_code + ' ', '')
  long_description    
from person_address pa  
 join [address] a on a.id = pa.address_id  
 join country c on c.id = a.country_id