CREATE procedure [dbo].[SaveCardStep](@card_id int, @step_id int, @responsible_id int = null, @load_card bit = 1)      
as      
begin      
 declare @is_closing_step bit, @is_negative_closing_step bit,     
 @history_type int = 1, @start_incident bit = 0, @current_date datetime = dbo.getCurrentDateTime()     
      
 select @is_closing_step = is_closing_step,       
   @is_negative_closing_step = is_negative_closing_step,      
   @start_incident = cs.start_incident      
 from card_step cs where cs.id = @step_id       
      
 if(@is_closing_step = 1 or @is_negative_closing_step = 1)      
 begin      
  exec [SaveCardHistory] @card_id, 3, @responsible_id      
      
  -- if incident is not started yet, update its started_on      
  update i set started_on = dbo.getCurrentDateTime()       
  from incident i      
  where card_id = @card_id       
   and started_on is null       
   and closed_on is null      
   and closed = 0      
   and cancelled = 0       
      
  update i set closed_on = dbo.getCurrentDateTime(), closed = 1       
  from incident i      
  where card_id = @card_id       
   and started_on is not null       
   and closed_on is null      
   and closed = 0      
   and cancelled = 0      
      
  update [card] set closed = 1, closed_on = dbo.getCurrentDateTime() where id = @card_id and closed = 0    
      
   declare @target int    
    
 select top 1 @target = person_id     
 from person_card pc where pc.card_id = @card_id and pc.position = 5    
     
 if(@target is not null)    
 begin    
  declare @register_treated bit = 0, @target_branch int,     
   @result_description nvarchar(max) = 'Confirmou participação',    
   @parent_template int    
    
  select @target_branch = branch_id from person where id = @target    
    
  select @parent_template = parent.card_template_id     
  from [card] c    
   join [card] parent on parent.id = c.parent_id    
  where c.id = @card_id     
    
  if(@parent_template = 2)    
  begin     
   set @result_description = 'Confirmou participação'    
    
   if(@is_negative_closing_step = 1)    
   begin    
    set @register_treated = 1    
    set @result_description = 'Não participará'    
   end    
  end    
  else     
  begin    
   set @result_description = 'Finalizado contato sobre essa tarefa'       
  end    
      
 /* exec RegisterNewIncident  @type = 5, @people = @target, @branch = @target_branch,     
  @date = @current_date, @description = @result_description, @register_closed = 1,     
  @responsible_id = @responsible_id, @register_treated = @register_treated,    
  @card_id = @card_id */  
 end      
 end        
 else    
 begin    
 update [card] set closed = 0, closed_on = null where id = @card_id and closed = 1    
 end    
      
 if(@start_incident = 1)      
 begin       
  update i set started_on = dbo.getCurrentDateTime()       
  from incident i      
  where card_id = @card_id       
   and started_on is null       
   and closed_on is null      
   and closed = 0      
   and cancelled = 0         
 end      
        
 update [card] set current_step_id = @step_id where id = @card_id      
       
 exec [SaveCardHistory] @card_id, 1, @responsible_id, @step_id    
 exec CheckCardsHasOverdueCards @card_id        
       
 if(exists(  
 select 1   
 from card_step cs     
  join [card] c on cs.card_id = c.id    
 where cs.id = @step_id  
  and cs.[order] = 2  
  and c.card_template_id = 11  
 ))      
 begin  
 --moving to send voucher state  
  
 update person_relationship set second_voucher_sended_date = dbo.getCurrentDate()  
 where monitoring_card_id = @card_id  
  and second_voucher_sended_date is null  
  and first_voucher_sended_date is not null  
  
 update person_relationship set first_voucher_sended_date = dbo.getCurrentDate()  
 where monitoring_card_id = @card_id  
  and first_voucher_sended_date is null  
  
 update c set c.due_date = case when exists(select 1 from person_relationship   
   where first_voucher_sended_date is not null   
    and second_voucher_sended_date is null   
    and monitoring_card_id = @card_id) then   
     DATEADD(DAY, (select cast(value as int) from configuration where id = 3), getUTCdate())  
  when exists(select 1 from person_relationship   
   where second_voucher_sended_date is not null   
    and monitoring_card_id = @card_id) then   
     DATEADD(DAY, (select cast(value as int) from configuration where id = 4), getUTCdate())  
  else c.due_date        
  end  
 from [card] c   
 where c.id = @card_id  
  
 end  
  
 if(@load_card = 1)
	select * from vwCard where id = @card_id      
	for json path      
      
end