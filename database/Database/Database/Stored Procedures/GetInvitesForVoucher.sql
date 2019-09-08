
CREATE procedure [dbo].[GetInvitesForVoucher]
as
begin
	
	select distinct max(b.id) branch, pc.person_id
	into #branches
	from person_card pc
		join [card] c on c.id = pc.card_id	
		join [card] parent on parent.id = c.parent_id
		join [branch] b on b.location_id = c.location_id
	where c.cancelled = 0 and c.archived = 0
		and parent.card_template_id in (11)
	group by pc.person_id

	select pr.*, LEFT(pr.identifier, 5) [key], p.name indicator, p2.name indicated,
	(select  * from person_contact pc where pc.removed = 0 and pc.person_id = p2.id for json path) contacts,
	ISNULL(b.branch, '') branch_id
	from person_relationship pr
		join person p on p.id = pr.person_id
		join person p2 on p2.id = pr.person2_id
		left join #branches b on b.person_id = pr.person2_id
	for json path

end