CREATE procedure GetIncidentsInProgress
as
begin

	select *
	from vwIncident 
	where started_on_hour is not null
		and closed = 0
		and treated = 0
		and cancelled = 0
	for json path


end