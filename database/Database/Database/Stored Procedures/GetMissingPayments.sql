CREATE procedure [dbo].[GetMissingPayments](
	@account_id int
)
as
begin
	declare @current_date date = cast(getdate() as date)

	select i.* 
		into #missing
		from vwIncident i		
			join account a on a.branch_id = i.branch_id				
		where cancelled = 0
		and financial_type > 0
		and treated = 0
		and closed = 0 
		and a.principal = 1
		and [date] < GETDATE()		
		and a.id = @account_id	
	
	if(not exists(select 1 from #missing))
	begin		
		select CAST(1 as bit) empty
		for json path
		return
	end

	select 
		(select SUM(final_value) from #missing) total,
		(select * from #missing order by full_date for json path) missing
	for json path
	
	drop table #missing

end