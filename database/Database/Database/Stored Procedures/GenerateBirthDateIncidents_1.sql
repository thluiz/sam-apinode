CREATE procedure GenerateBirthDateIncidents(@person_id int = null, @month int = null, @year int = null)
as
begin
	if(@month is null)
		set @month = datepart(month, getUTCdate())

	if(@year is null)
		set @year = datepart(year, getUTCdate())

	declare @fist_day_of_month date = datefromparts(@year, @month, 1)
	declare @last_day_of_month date = dateadd(day, -1, dateadd(month, 1, @fist_day_of_month))

	select * 
	into #dates
	from(
		select id, branch_id, datefromparts(datepart(year, getUTCdate()), datepart(month, [birth_date]), datepart(day, [birth_date])) birth_date, 1 btype 
		from person 
		where datefromparts(datepart(year, getUTCdate()), datepart(month, [birth_date]), datepart(day, [birth_date])) 
			between @fist_day_of_month and @last_day_of_month
			and id = isnull(@person_id, id)
	union all
		select id, branch_id, datefromparts(datepart(year, getUTCdate()), datepart(month, [admission_date]), datepart(day, [admission_date])) birth_date, 2
		from person 
		where datefromparts(datepart(year, getUTCdate()), datepart(month, [admission_date]), datepart(day, [admission_date])) 
			between @fist_day_of_month and @last_day_of_month
			and id = isnull(@person_id, id)
	) births

	declare @person int, @date date, @btype int, @branch_id int, @incident_id int 

	while exists(select 1 from #dates)
	begin

		select top 1 @person = id , @date = birth_date, @btype = btype, @branch_id = branch_id from #dates
	
		delete from #dates where id = @person and btype = @btype

		if(exists(select 1 from  incident where date = @date and incident_type = (case when @btype = 1 then 30 else 31 end)))
			continue	

		insert into incident(incident_type, [date], branch_id, closed) values (
			case when @btype = 1 then 30 else 31 end, @date, @branch_id, 1
		) 

		set @incident_id = @@IDENTITY

		insert into person_incident(person_id, incident_id, participation_type) values (@person, @incident_id, 1)	

	end

	drop table #dates

end