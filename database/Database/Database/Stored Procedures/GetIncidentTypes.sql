
CREATE procedure GetIncidentTypes
as
begin
	select * 
	from vwIncidentType	
	order by [order]
	for json path
end

