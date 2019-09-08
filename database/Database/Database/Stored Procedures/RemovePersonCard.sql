CREATE procedure RemovePersonCard(    
@card_id int,     
@person_id int  
)    
as    
begin    
    
 if(exists(select 1   
   from [card] children   
   join person_card pc on pc.card_id = children.id  
   where children.parent_id = @card_id and person_id = @person_id and cancelled = 0 and archived = 0))  
 begin   
 return  
 end  
  
 delete from person_card   
 where person_id = @person_id     
  and card_id = @card_id    
    
end