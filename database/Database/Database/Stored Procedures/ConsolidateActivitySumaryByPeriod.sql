create procedure ConsolidateActivitySumaryByPeriod(
	@start date,
	@end date
) as
begin
	declare @date date = @start

	while(@date <= @end)
	begin
		exec ConsolidateActivitySumary @date = @date
		set @date = dateadd(day, 1, @date)
	end

end