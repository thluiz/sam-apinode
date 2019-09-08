CREATE procedure SavePersonCard(  
@card_id int,   
@person_id int,   
@position_id int,  
@position_description varchar(100),  
@order int  
)  
as  
begin  
  
 if(not exists(select 1 from person_card where card_id = @card_id and person_id = @person_id))
 begin
	insert into person_card(person_id, card_id, position, [order])
	values (@person_id, @card_id, 4, (select max([order]) + 1 from person_card where card_id = @card_id))

	return
 end

 update person_card set   
  position = @position_id,  
  position_description = @position_description,  
  [order] = @order  
 where person_id = @person_id   
  and card_id = @card_id  
  
end