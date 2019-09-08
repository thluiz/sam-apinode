CREATE procedure ConsolidateAccountBalances(@account_id int)
as
begin
	declare @current_date date = '2017-12-31', --initial date
	@previous_date date, @previous_balance decimal(12, 2)

	-- payments without closed on date
	update i set i.closed_on = i.date
	from incident i
	join enum_incident_type eit on eit.id = i.incident_type
	where eit.financial_type > 0
	and i.cancelled = 0
	and closed = 1
	and closed_on is null

	while(@current_date < dateadd(year, 1, getdate()))
	begin 
		set @previous_date = @current_date
		set @current_date = dateadd(day, 1, @current_date)

		insert into account_balance(account_id, [date], initial_balance, balance)
			select id, @current_date, 0 , 0
			from account a
			where not exists(select 1 
							from account_balance ab 
							where ab.date = @current_date
								and ab.account_id = a.id
							)
						


		-- previous balance
		update ab set ab.initial_balance = isnull((select balance from account_balance ab2 where ab2.[date] = @previous_date and ab2.account_id = ab.account_id ), 0)
		from account_balance ab
		where ab.[date] = @current_date
			and ab.account_id = @account_id

		update ab set ab.balance = ab.initial_balance +
			isnull((		
			select sum(final_value) 
			from vwIncident i				
				join account a on a.branch_id = i.branch_id
			where cast(closed_on as date) = @current_date
				and i.financial_type > 0
				and treated = 0
				and closed = 1
				and i.cancelled = 0
				and a.id = ab.account_id	
				and ab.account_id = @account_id	
			), 0),
			ab.missing = isnull((		
			select sum(final_value) 
			from vwIncident i				
				join account a on a.branch_id = i.branch_id
			where cast(i.[date] as date) = @current_date				
				and i.financial_type > 0
				and treated = 0
				and closed = 0				
				and i.cancelled = 0
				and a.id = ab.account_id
				and ab.account_id = @account_id						
			), 0),
			ab.total_missing =  isnull((select 
				total_missing 
				from account_balance ab3 
				where ab3.account_id = ab.account_id and cast(ab3.date as date) = @previous_date
				and ab.account_id = @account_id
			), 0) +
			isnull((		
			select sum(final_value) 
			from vwIncident i				
				join account a on a.branch_id = i.branch_id
			where cast(i.[date] as date) = @current_date
				--and cast(i.[date] as date) < GETDATE()
				and i.financial_type > 0
				and treated = 0
				and closed = 0				
				and i.cancelled = 0
				and a.id = ab.account_id	
				and ab.account_id = @account_id					
			), 0)	
		from account_balance ab
		where ab.[date] = @current_date
			and ab.account_id = @account_id

	end

end