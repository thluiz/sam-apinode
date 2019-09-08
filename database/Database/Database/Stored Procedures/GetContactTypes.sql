create procedure GetContactTypes
as
begin

	select * 
	from enum_contact_type
	for json path

end