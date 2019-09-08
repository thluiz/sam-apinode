CREATE procedure [dbo].[CancelPersonSchedule](  
 @person_schedule_id int,  
 @cancelled_by int = null  
)  
as  
begin   
  
 update incident set cancelled = 1, cancelled_on = getUTCdate(), cancelled_by = @cancelled_by  
 where person_schedule_id = @person_schedule_id  
	and closed = 0
	and treated = 0
	and cancelled = 0
	and [date] >= dbo.getCurrentDate()
  
 update person_schedule set active = 0,   
   cancelled = 1, cancelled_on = getUTCdate(),   
   cancelled_by = @cancelled_by  
 where id = @person_schedule_id  
  
end