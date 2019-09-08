CREATE procedure GetIncidentDetails(@id int)
as
begin

	select * 
	from vwIncident i
	where i.id = @id
	for json path

end