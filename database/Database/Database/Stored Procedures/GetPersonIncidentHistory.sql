
CREATE procedure GetPersonIncidentHistory(
	@person_id int, @activity_type int, @page int = 2, @pagesize int = 10
)
as
begin

	select * 
	from vwIncident
	where id in (
		SELECT i.id		
		FROM incident i (nolock)
			join person_incident pic (nolock) on pic.incident_id = i.id	
			join enum_incident_type eit (nolock) on eit.id = i.incident_type
		where i.date <= dbo.getCurrentDateTime()
			and pic.person_id = @person_id
			and eit.activity_type = @activity_type
			and i.cancelled = 0	
		ORDER BY [date] desc
		OFFSET @pagesize * (@page - 1) ROWS 
		FETCH NEXT @pagesize ROWS ONLY	
	)
	order by full_date desc
	for json path

end