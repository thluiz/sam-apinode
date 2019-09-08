CREATE procedure GetPersonAddress(  
 @person_id int  
)  
as  
begin  
    
 select * from vwPersonAddress where person_id = @person_id and archived = 0  
 for json path  
  
end