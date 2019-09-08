CREATE procedure [dbo].[RemovePersonContact](
	@contact_id int
) as
begin

	update person_contact set removed = 1 where id = @contact_id

	declare @person_id int = (select person_id from person_contact where id = @contact_id)

	exec CheckPeopleStatus @person_Id

end