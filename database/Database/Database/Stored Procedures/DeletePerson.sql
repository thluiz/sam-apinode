create procedure DeletePerson (@person int)
as
begin

	delete from person_role where person_id = @person

	delete from person_incident where person_id = @person
	delete from incident where id in (select incident_id from person_incident where person_id = @person)

	delete from person_relationship where person2_id = @person
	delete from person_relationship where person_id = @person

	delete from person_comment where person_id = @person

	delete from person_contact where person_id = @person

	delete from person where id  = @person

end