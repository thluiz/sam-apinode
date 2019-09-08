CREATE procedure GetPersonPendingCommunication(
	@person_id int
)
as
begin

select 	
	(select * from vwPerson where id = @person_id for json path) person,
	(select i.*
		from vwIncident i
			join person_incident pic on pic.incident_id = i.id
		where [type] = 5 
			and treated = 0 
			and i.closed = 0 
			and i.cancelled = 0 
			and pic.person_id = @person_id
			and i.[full_date] < dbo.getCurrentDateTime()
	for json path
	) incidents,

	(select c.*
		from [vwCard] c
			join person_card pc on c.id = pc.card_id
			join [card] parent on c.parent_id = parent.id
			left join [card] grand_parent on parent.parent_id = grand_parent.id
		where pc.person_id = @person_id
			and pc.position = 5
			and c.closed = 0 
			and c.cancelled = 0
			and c.archived = 0
			and not exists(
				select 1 from [card] parent					
				where parent.id = c.parent_id
				and (closed_on = 1
					or cancelled = 1
					or archived = 1)
			)
			and not exists(
				select 1 from [card] parent
				join [card] grand_parent on grand_parent.id = parent.parent_id					
				where parent.id = c.parent_id
				and (grand_parent.closed_on = 1
					or grand_parent.cancelled = 1
					or grand_parent.archived = 1)
			)
		order by c.high_level_title, c.parent_title, c.title
	for json path) communications
	for json path, root('pending')
					
end