create procedure ArchiveAddress(@address_id int)
as
begin

	update address set archived = 1 where id = @address_id

	update person_address set archived = 1 where address_id = @address_id

end