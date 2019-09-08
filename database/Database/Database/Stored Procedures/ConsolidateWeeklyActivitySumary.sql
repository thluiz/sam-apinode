CREATE procedure ConsolidateWeeklyActivitySumary(  
 @branch int = null,  
 @date date = null  
)  
as begin  
  
 if(@date is null)   
  set @date = getUTCdate()  
    
 declare @week int = (select top 1 id from [week] where [start] <= @date and [end] >= @date)  
  
 insert into activity_sumary([week_id], branch_id, activity_type)    
  select @week, b.id, eat.id  
  from enum_activity_type eat, branch b  
  where    
  b.id = isnull(b.id, @branch)      
  and b.active = 1    
  and not exists (    
   select 1 from activity_sumary s    
   where s.branch_id = isnull(b.id, @branch)       
    and s.[week_id] = @week    
    and s.activity_type = eat.id   
  )    
  
  
 update acs set   
  acs.expected = total.expected,  
  acs.not_treated = total.not_treated,  
  acs.treated = total.treated,  
  acs.unexpected = total.unexpected,  
  acs.closed = total.closed  
 from activity_sumary acs  
 join (  
  select w.id, acs.branch_id, acs.activity_type,   
   sum(expected) expected, sum(unexpected) unexpected, sum(treated) treated, sum(not_treated) not_treated, sum(closed) closed  
  from [week] w   
   join activity_sumary acs on w.start <= acs.[date] and w.[end] >= acs.[date]  
  where w.id = @week  
   and acs.branch_id = isnull(@branch, acs.branch_id)  
  group by w.id, acs.branch_id, acs.activity_type  
 ) total on total.branch_id = acs.branch_id  
   and total.activity_type = acs.activity_type     
 where   
  acs.week_id = @week  
  and acs.branch_id = isnull(@branch, acs.branch_id)  
  and (acs.expected != total.expected   
   or acs.not_treated != total.not_treated  
   or acs.treated != total.treated  
   or acs.unexpected != total.unexpected  
   or acs.closed != total.closed)  
  
  
end