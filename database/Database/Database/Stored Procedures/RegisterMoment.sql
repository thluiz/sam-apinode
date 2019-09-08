CREATE procedure [dbo].[RegisterMoment](@title varchar(300), 
@participants varchar(max), @fund_value decimal(12,2))
as
begin
	insert into incident(
		responsible_id, created_on, [date],
		incident_type, closed, branch_id, 
		[description]
	) values (
		11, getUTCdate(), cast(getUTCdate() as date), 2, 1, 4, @title
	)	 

	insert into person_incident(person_id, incident_id, participation_type) 
		select item, @@IDENTITY, 2
		from dbo.Split(@participants, ',') 		

	if(@fund_value > 0)
	begin 
		insert into incident(responsible_id, created_on, [date], incident_type, closed, branch_id, fund_value)
		values (11, getUTCdate(), cast(getUTCdate() as date), 3, 0, 4, @fund_value)
	end

end

