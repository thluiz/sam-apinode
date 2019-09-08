
--select * from [card] where id = 214

CREATE procedure CheckCardsHasOverdueCards(
	@card_id int = null
)
as
begin
	update c set has_overdue_card = 0 
	from [card] c
	where has_overdue_card = 1
		and due_date is not null
		and cancelled = 0
		and archived = 0
		and (due_date >= dbo.getCurrentDateTime()
			or closed = 1
			or closed_on is not null)
		and id = ISNULL(@card_id, id)
		and not exists(select 1 from [card] children where children.has_overdue_card = 1 and children.parent_id = c.id)


	update c set has_overdue_card = 1 
	from [card] c
	where has_overdue_card = 0
		and due_date is not null
		and due_date < dbo.getCurrentDateTime()
		and closed = 0
		and closed_on is null
		and cancelled = 0
		and archived = 0
		and id = ISNULL(@card_id, id)


	update parent set parent.has_overdue_card = 1
	from [card] parent
	where parent.has_overdue_card = 0
		and parent.cancelled = 0
		and parent.archived = 0
	and exists(
		select 1 from [card] c where c.has_overdue_card = 1 
			and c.parent_id = parent.id 
			and c.cancelled = 0
			and c.archived = 0
	)

	-- since exists two levels of projects, update the upper level	
	update parent set parent.has_overdue_card = 1
	from [card] parent
	where parent.has_overdue_card = 0	
	and exists(
		select 1 from [card] c where c.has_overdue_card = 1 
			and c.parent_id = parent.id 
			and c.cancelled = 0
			and c.archived = 0
	)

	update parent set parent.has_overdue_card = 0
	from [card] parent	
	where parent.has_overdue_card = 1
	and (
		(closed = 1)
		or ((due_date is null or due_date >= dbo.getCurrentDateTime())
			and not exists(
				select 1 from [card] c where c.has_overdue_card = 1 		
					and c.parent_id = parent.id 
					and c.cancelled = 0
					and c.archived = 0))
	)

	-- since exists two levels of projects, update the upper level	
	update parent set parent.has_overdue_card = 0
	from [card] parent	
	where parent.has_overdue_card = 1
	and (
		(closed = 1)
		or ((due_date is null or due_date >= dbo.getCurrentDateTime())
			and not exists(
				select 1 from [card] c where c.has_overdue_card = 1 		
					and c.parent_id = parent.id 
					and c.cancelled = 0
					and c.archived = 0
			))
	)
end