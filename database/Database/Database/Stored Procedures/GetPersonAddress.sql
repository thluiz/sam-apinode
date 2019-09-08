CREATE procedure GetPersonAddress(
	@person_id int
)
as
begin

	if(not exists(select 1 from person_address pa where archived = 0 and pa.person_id = @person_id))
	begin
		select cast(1 as bit) empty for json path
		return 
	end

	select * from vwPersonAddress where person_id = @person_id and archived = 0
	for json path

end