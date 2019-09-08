
CREATE procedure GetAccountStatusInPeriod(
	@account_id int,
	@start_date date = null,
	@end_date date = null
)
as
begin 

	if(@start_date is null)
		set @start_date = DATEADD(day, -7, getUTCdate())

	if(@end_date is null)
		set @end_date = DATEADD(day, 7, getUTCdate())

	select
		@start_date start_date,
		@end_date end_date,
		(select top 1 initial_balance balance, total_missing 
		from account_balance ab 
		where ab.account_id = @account_id and [date] = @start_date
		for json path) initial,
		(select top 1 balance, total_missing 
		from account_balance ab 
		where ab.account_id = @account_id and [date] = @end_date
		for json path
		) expected_balance		
	for json path

end