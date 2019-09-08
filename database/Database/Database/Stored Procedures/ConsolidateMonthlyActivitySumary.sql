CREATE procedure ConsolidateMonthlyActivitySumary(  
 @branch int = null,  
 @date date = null  
)  
as begin  
 if(@date is null)   
  set @date = getUTCdate()  
  
 declare @month int = (select top 1 id from [month] where [start] <= @date and [end] >= @date)  
  
 insert into activity_sumary([month_id], branch_id, activity_type)    
 select @month, b.id, eat.id  
 from enum_activity_type eat, branch b  
 where    
 b.id = isnull(b.id, @branch)      
 and b.active = 1    
 and not exists (    
  select 1 from activity_sumary s    
  where s.branch_id = isnull(b.id, @branch)       
   and s.[month_id] = @month    
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
  select m.id, acs.branch_id, acs.activity_type,   
   sum(expected) expected, sum(unexpected) unexpected, sum(treated) treated, sum(not_treated) not_treated, sum(closed) closed  
  from [month] m   
   join activity_sumary acs on m.start <= acs.[date] and m.[end] >= acs.[date]  
  where m.id = @month  
   and acs.branch_id = isnull(@branch, acs.branch_id)  
  group by m.id, acs.branch_id, acs.activity_type  
 ) total on total.branch_id = acs.branch_id  
   and total.activity_type = acs.activity_type     
 where   
  acs.month_id = @month  
  and acs.branch_id = isnull(@branch, acs.branch_id)  
  and (acs.expected != total.expected   
   or acs.not_treated != total.not_treated  
   or acs.treated != total.treated  
   or acs.unexpected != total.unexpected  
   or acs.closed != total.closed)  
  
end  
  
  