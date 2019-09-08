CREATE procedure MergePerson(@correct_person int, @person_to_merge int)
as
begin

	BEGIN TRAN

	BEGIN TRY

		delete from person_role where person_id = @person_to_merge

		update pic set pic.person_id = @correct_person
			from person_incident pic where person_id = @person_to_merge

		update pr set pr.person2_id = @correct_person 
		from person_relationship pr where person2_id = @person_to_merge

		update pr set pr.person_id = @correct_person 
		from person_relationship pr where person_id = @person_to_merge

		update pc set pc.person_id = @correct_person 
		from person_contact pc where person_id = @person_to_merge

		update pc set pc.person_id = @correct_person 
		from person_comment pc where person_id = @person_to_merge

		delete from person where id = @person_to_merge

	   COMMIT TRAN

	END TRY
	BEGIN CATCH
		SELECT   
			ERROR_NUMBER() AS ErrorNumber  
		   ,ERROR_MESSAGE() AS ErrorMessage; 

		ROLLBACK TRAN
	END CATCH
	

end