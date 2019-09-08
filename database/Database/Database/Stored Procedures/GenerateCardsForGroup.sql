CREATE procedure GenerateCardsForGroup(
	@card_id int, 
	@card_step int,
	@group_id int,
	@branch_id int
)
as
begin

	declare @person int, @target_card_id int
	create table #targets(id int)

	insert into #targets(id)		
		select id 
		from person
		where 
			(@group_id = 1 and branch_id = @branch_id and is_active_member = 1)
			or (@group_id = 2 and isnull(branch_id, -1) = isnull(@branch_id, -1) and is_inactive_member = 1)
			or (@group_id = 3 and isnull(branch_id, -1) = isnull(@branch_id, -1) and is_disciple = 1)
			or (@group_id = 4 and isnull(branch_id, -1) = isnull(@branch_id, -1) and is_disciple = 1 and is_inactive_member = 1)
			or (@group_id = 5 and isnull(branch_id, -1) = isnull(@branch_id, -1) and is_interested = 1)
			or (@group_id = 6 and isnull(branch_id, -1) = isnull(@branch_id, -1) and is_external_member = 1)


	while(exists(select 1 from #targets))
	begin
		select top 1 @person = id from #targets

		insert into [card]  
		(title, parent_id, due_date, feature_area_id, [description], [leader_id], card_template_id, location_id, abrev, current_step_id)  
		values  
		('', @card_id, null, 1, '', null, 1, 0, null, @card_step) 
		
		set @target_card_id = @@IDENTITY

		insert into [person_card](person_id, card_id, position) 
		values (@person, @target_card_id, 5)

		delete from #targets where id = @person
	end		
end