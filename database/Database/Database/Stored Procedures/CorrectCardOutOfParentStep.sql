create procedure CorrectCardOutOfParentStep
as
begin
	update c set c.current_step_id = (select top 1 id from card_step cs where cs.card_id = parent.id)
	from [card] c
	join [card] parent on parent.id = c.parent_id
	where c.current_step_id not in (
		select id from card_step cs where cs.card_id = parent.id
	) and c.current_step_id is not null
end