CREATE procedure [dbo].[ToggleCardArchived](@card_id int, @responsible_id int = null)
as
begin
	
	update card set archived = case when archived = 1 then 0 else 1 end where id = @card_id

	exec SaveCardHistory @card_id, 6, @responsible_id

	exec GenerateIncidentsForCard @card_id
	exec CheckCardsHasOverdueCards @card_id

	select * from vwCard
	where id = @card_id
	for json path

end