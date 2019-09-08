CREATE procedure getOwnershipData(@ownership_id int)
as
begin 
		
	select top 1 *, 
	(select * from vwIncident v where id in (
	select i.id
	from incident tit
		join incident i on i.branch_id = tit.branch_id						
							and i.id != tit.id
							and i.cancelled = 0
							and (( i.started_on between tit.started_on and tit.closed_on 
									or i.closed_on between tit.started_on and tit.closed_on))
	where tit.id = @ownership_id)
	order by v.full_date
	for json path) incidents
	from vwIncident where id = @ownership_id
	for json path

end