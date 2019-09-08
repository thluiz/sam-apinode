CREATE view vwPersonContact      
with schemabinding    
as      
 select pc.id, pc.contact, pc.details, pc.person_id, pc.principal, pc.removed,     
 epc.[description] contact_type_description, epc.icon, epc.base_url, pc.contact_type         
 from dbo.person_contact pc  (nolock)          
 join dbo.enum_contact_type epc (nolock) on epc.id = pc.contact_type 