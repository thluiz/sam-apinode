create procedure SaveCardOrder(@card_id int, @order int)
as
begin
	update [card] set [order] = @order where id = @card_id
end