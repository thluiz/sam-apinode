create procedure GetRecurrenceTypes
as
begin

	select *             
	from recurrence_type            
	where active = 1            
	for json path   

end