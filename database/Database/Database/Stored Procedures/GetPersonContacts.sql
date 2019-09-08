
CREATE procedure [dbo].[GetPersonContacts](@person_id int, @only_principal bit = 0)      
as      
begin       
      
 if(not exists(select 1 from person_contact where person_id = @person_id and removed = 0 and (@only_principal = 0 or principal = 1)))  
 begin  
 select CAST(1 as bit) empty for json path  
 return;  
 end  
  
 select * from vwPersonContact pc   
 where person_id = @person_id      
  and removed = 0     
  and (@only_principal = 0 or pc.principal = 1)   
 order by principal desc, contact_type      
 for json path      
      
end