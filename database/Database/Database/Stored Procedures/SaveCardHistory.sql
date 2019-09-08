CREATE procedure [dbo].[SaveCardHistory](
	@card_id int,
	@history_type int,
	@responsible_id int,
	@new_step_id int = null
)
as
begin
	declare @current_card_id int = (
		select top 1 c.id 
		from [card] c 
			join person_card pc on pc.card_id = c.id			
		where started_on <= getdate() and closed_on is null	
			and 
				((c.leader_id = @responsible_id)
				or
				(pc.position in (1, 6) and  pc.person_id = @responsible_id))
				
	)	

	insert into card_history(card_id, created_on, 
		responsible_id, history_type, created_during_card_id,
		new_step_id)
	values (
		@card_id, getdate(), 
		@responsible_id, @history_type, @current_card_id, 
		@new_step_id
	)

	
end