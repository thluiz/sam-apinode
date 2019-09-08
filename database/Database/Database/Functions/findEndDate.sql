CREATE function findEndDate(@schedule_id int)
returns date
as
begin 
	declare @end_date date,
			@start_date date,
			@number_of_events int,
			@recurrence_type int,
			@current_date date

	select @end_date = end_date, @start_date = [start_date], 
			@number_of_events = number_of_incidents,
			@recurrence_type = recurrence_type
	from person_schedule where id = @schedule_id

	if(@end_date is not null)
		return @end_date

	if(@recurrence_type = 2)
	begin 
		set @end_date = DATEADD(week, @number_of_events - 1, @start_date)
	end
	else if(@recurrence_type = 3)
	begin 
		set @end_date = DATEADD(week, 2*(@number_of_events - 1), @start_date)
	end
	else if(@recurrence_type = 4)
	begin 
		set @end_date = DATEADD(month, @number_of_events - 1, @start_date)
	end
	
	return @end_date

end
