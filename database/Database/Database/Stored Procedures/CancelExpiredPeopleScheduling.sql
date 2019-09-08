create procedure CancelExpiredPeopleScheduling
as
begin
	update person_schedule set cancelled = 1, cancelled_on = GETUTCDATE() where end_date < dbo.getCurrentDateTime() and cancelled = 0
end