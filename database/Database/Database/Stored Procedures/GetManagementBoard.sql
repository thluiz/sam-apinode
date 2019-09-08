CREATE procedure GetManagementBoard
as
begin

	select title, 
		(select pa.alias person, p.avatar_img, 
			isnull(pc.position_description, pcp.name) position
		from person_card pc
			join person_card_position pcp on pcp.id = pc.position
			join person p on p.id = pc.person_id
			left join person_alias pa on pa.person_id = p.id and pa.principal = 1
		where pc.card_id = c.id
		order by pc.[order], pc.[position]		
		for json path) team
	from card c
	where parent_id is null
		and cancelled = 0
		and archived = 0
	order by c.[order]		
	for json path
	

end

