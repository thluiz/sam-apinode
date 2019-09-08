CREATE procedure SaveAddress(
	@country_id int,
	@postal_code varchar(30),
	@street varchar(200),
	@district varchar(100),
	@city varchar(100),
	@state varchar(100),
	@number varchar(30),
	@complement varchar(50),
	@person_id int = null
)as
begin
	declare @address_id int
	insert into [address](country_id, postal_code, street, district, city, [state], number, complement)
	values(@country_id, @postal_code, @street, @district, @city, @state, @number, @complement)

	set @address_id = @@IDENTITY

	if(@person_id is not null)
		insert into person_address(person_id, address_id) values (@person_id, @address_id)	

end