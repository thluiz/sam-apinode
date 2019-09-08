CREATE procedure [dbo].[GetCardCommentaries] (
	@card_id int
)
as
begin

	 if(not exists(select 1 from vwCardCommentary cc where cc.card_id = @card_id and cc.archived = 0))  
	 begin  
	  select cast(1 as bit) empty for json path  
	  return  
	 end  

	select * from vwCardCommentary where card_id = @card_id
	order by created_on desc
	for json path

end