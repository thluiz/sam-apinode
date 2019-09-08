
CREATE procedure [getFlatOrganizationsData]
as
begin
	select id, title,
		(select id, title,
			(select id, name 
			from card_step cs
			where cs.card_id = p.id
				and archived = 0
			order by cs.[order]
			for json path) steps,
			(
			select id, title,
				(select id, name 
				from card_step cs
				where cs.card_id = sp.id
					and archived = 0					
				order by cs.[order]
				for json path) steps
			from card sp 
			where sp.parent_id = p.id
				and archived = 0
				and closed = 0
				and exists(select 1 from card_step cs
							where cs.card_id = sp.id
								and archived = 0)
			for json path
			) subprojects	 
		from card p 
		where p.parent_id = o.id
			and archived = 0
			and closed = 0
			and exists(select 1 from card_step cs
							where cs.card_id = p.id
								and archived = 0)
		order by p.[order]
		for json path) childs,
		(select pc.id, p.name, pc.person_id 
		from person_card pc 
			join vwPerson p on pc.person_id = p.id and pc.card_id = o.id
		where position !=  5 	
		order by pc.[order]
		for json path	
		) people
	from card o
	where parent_id is null
		and archived = 0 
		and closed = 0
	for json path
end