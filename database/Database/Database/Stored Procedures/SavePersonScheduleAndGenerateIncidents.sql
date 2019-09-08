CREATE procedure SavePersonScheduleAndGenerateIncidents(        
 @person_id int,        
 @branch_id int,        
 @incident_type int,        
 @recurrence_type int,        
 @start_date date,        
 @start_hour int,        
 @start_minute int,        
 @end_date date,        
 @end_hour int,        
 @end_minute int,        
 @number_of_incidents int,        
 @description nvarchar(max),        
 @value decimal(12,2),  
 @responsible_id int = null        
)        
as        
begin         
        
 insert into person_schedule(        
  person_id, week_day, start_hour, start_minute, active,         
  incident_type, month_day, [value], end_hour, end_minute,        
  recurrence_type, [start_date], end_date, [description],        
  number_of_incidents, branch_id, responsible_id        
 ) values (        
  @person_id, datepart(WEEKDAY, @start_date), @start_hour, @start_minute, 1,        
  @incident_type, datepart(day, @start_date), @value, @end_hour, @end_minute,        
  @recurrence_type, @start_date, @end_date, @description,        
  @number_of_incidents, @branch_id, @responsible_id        
 )          
        
 declare @schedule_id int = @@identity        
        
 if(@end_date is null)        
  update person_schedule set end_date = dbo.findEndDate(@schedule_id)        
  where id = @schedule_id        
        
 if(@number_of_incidents is null)        
  update person_schedule set number_of_incidents = dbo.findNumberOfEvents(@schedule_id)        
  where id = @schedule_id        

 if(exists(select 1 from person_schedule where id = @schedule_id and number_of_incidents > 108))
 begin
    update person_schedule set number_of_incidents = 108
    where id = @schedule_id  
 end        

 if(@recurrence_type = 4)        
 begin        
  exec GenerateMonthlyIncidents @schedule_id, @responsible_id         
 end        
 else if(@recurrence_type = 2 or @recurrence_type = 3)        
 begin        
  exec GenerateWeeklyIncidents @schedule_id, @responsible_id     
 end        
      
 exec CheckPeopleStatus @person_id      
          
end    
      