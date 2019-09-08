create procedure SaveCardCommentary(
@card_id int, 
@commentary nvarchar(max),
@user_id int
)
as
begin

	insert into card_commentary(card_id, commentary, created_on, responsible_id)	
	values (@card_id, @commentary, dbo.getCurrentDateTime(), @user_id)


	select * from vwCardCommentary where card_id = @card_id
	for json path

end