CREATE procedure GenerateWeeklyIncidents          
(@schedule_id int, @responsible_id int = null)          
as          
begin           
           
 declare @end_date date, @current_date datetime, @recurrence_type int,           
  @person_id int, @branch_id int, @program_id int,          
  @value decimal(12, 2), @incident_type int, @schedule_type int,      
  @start_hour int, @start_minute int,      
  @incident_id int          
          
 select @current_date = [start_date], @end_date = end_date,          
  @recurrence_type = recurrence_type,          
  @person_id = person_id, @branch_id = ps.branch_id,          
  @program_id = p.program_id, @value = ps.[value],          
  @schedule_type = ps.schedule_type,         
  @start_hour = isnull(ps.start_hour, 0), @start_minute = isnull(ps.start_minute, 0),       
  @incident_type = eit.id    
 from person_schedule ps          
  join person p on p.id = ps.person_id          
  join enum_incident_type eit on eit.id = ps.incident_type          
  left join program prg on prg.id = p.program_id          
 where ps.id = @schedule_id           
         
 declare @i int = 0             
           
 if(@recurrence_type in (2, 3))           
 begin          
  while(@current_date <= @end_date and @i < 108)          
  begin             
   insert into incident(          
    created_on, responsible_id, incident_type,       
 [date],           
    branch_id, [value], person_schedule_id, scheduled           
   ) values (          
    getUTCdate(), @responsible_id, @incident_type,       
 dateadd(hour, @start_hour, dateadd(minute, @start_minute, @current_date)),           
    @branch_id, @value, @schedule_id, 1          
   )          
             
   set @incident_id = @@IDENTITY          
          
   insert into person_incident(person_id, incident_id, participation_type)          
   values (@person_id, @incident_id, 1)          
             
   set @current_date = dateadd(week, (@recurrence_type - 1), @current_date)    
   set @i = @i + 1         
  end          
 end          
          
end