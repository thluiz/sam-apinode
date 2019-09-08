CREATE function findNumberOfEvents(@schedule_id int)  
returns int  
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
  
 if(@number_of_events is not null)  
  return @number_of_events  
  
 set @number_of_events = 0

 while(@current_date < @end_date)
 begin
	set @number_of_events = @number_of_events + 1
	 if(@recurrence_type = 2)  
	 begin   
	  set @current_date = DATEADD(week, 1, @current_date)  
	 end  
	 else if(@recurrence_type = 3)  
	 begin   
	  set @current_date = DATEADD(week, 2, @current_date)  
	 end  
	 else if(@recurrence_type = 4)  
	 begin   
	  set @current_date = DATEADD(month, 1, @current_date)  
	 end  
 end
 
   
 return @number_of_events  
  
end  