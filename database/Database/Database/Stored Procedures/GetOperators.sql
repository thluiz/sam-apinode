create procedure GetOperators
as
begin

	select p.* 
	from person p
	where p.is_director = 1
		or p.is_manager = 1 
		or p.is_operator = 1
	order by p.name -- isnull(p.admission_date, dateadd(year, 1, getUTCdate()))
	for json path


end