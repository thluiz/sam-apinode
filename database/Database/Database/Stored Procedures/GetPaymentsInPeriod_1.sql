CREATE procedure [dbo].[GetPaymentsInPeriod](    
 @account_id int,    
 @start_date date = null,    
 @end_date date = null    
)    
as    
begin    
 declare @current_date date = cast(getUTCdate() as date)    
    
 if(@start_date is null)    
  set @start_date = DATEADD(day, -7, getUTCdate())    
    
 if(@end_date is null)    
  set @end_date = DATEADD(day, 7, getUTCdate())    
    
    
 select i.*    
  into #payments_in_period    
  from vwIncident i      
   join account a on ((a.branch_id = i.branch_id and i.type != 41) or (a.branch_id is null and @account_id = 9 and i.type = 41))        
  where [date] between @start_date and @end_date    
  and cancelled = 0      
  and treated = 0    
  and financial_type > 0  
  and a.id = @account_id    
  and a.principal = 1    
  and ((closed = 0     
    and cast([date] as date) between @start_date and @end_date    
    and cast([date] as date) >= @current_date
	)    
    or (closed = 1 and cast(closed_on as date) between @start_date and @end_date))       
     
 if(not exists(select 1 from #payments_in_period))    
 begin    
  select CAST(1 as bit) empty    
  for json path    
  return    
 end    
    
    
 select     
  @start_date start_date,    
  @end_date end_date,    
  isnull((select SUM(final_value)    
   from #payments_in_period where closed_on is not null), 0) total_payments,    
  isnull((select SUM(final_value)    
    from #payments_in_period where closed_on is null), 0) total_expected,    
  isnull((select SUM(final_value)    
    from #payments_in_period), 0) total,    
  (select *     
  from #payments_in_period     
  order by isnull(closed_on, cast(full_date as date))    
  for json path) payments    
 for json path    
     
 drop table #payments_in_period    
    
end