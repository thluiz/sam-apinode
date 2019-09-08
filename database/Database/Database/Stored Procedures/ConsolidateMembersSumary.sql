CREATE procedure [dbo].[ConsolidateMembersSumary]        
 @branch int = null,        
 @program int = null,      
 @start_date date = null         
as         
begin      
       
 if(@start_date is null)         
 set @start_date = dbo.getCurrentDate()      
  
 declare @month int = (select id from [month] where [start] <= @start_date and [end] >= @start_date)      
 declare @week int = (select id from [week] where [start] <= @start_date and [end] >= @start_date)      
        
 insert into members_sumary([date], branch_id, program_id, people,         
 financial_issues, scheduling_issues, comunication_issues)        
  select @start_date, b.id, p.id, 0, 0, 0, 0        
  from branch b, program p        
  where        
   b.id = isnull(b.id, @branch)         
   and p.id = isnull(p.id, @program)         
   and b.active = 1        
   and not exists (        
    select 1 from members_sumary m        
    where m.branch_id = isnull(b.id, @branch)        
     and m.program_id = isnull(p.id, @program)        
     and m.[date] >= @start_date        
   )        
      
 insert into members_sumary([month_id], branch_id, program_id, people,         
 financial_issues, scheduling_issues, comunication_issues)        
  select @month, b.id, p.id, 0, 0, 0, 0        
  from branch b, program p        
  where        
   b.id = isnull(b.id, @branch)         
   and p.id = isnull(p.id, @program)         
   and b.active = 1        
   and not exists (        
    select 1 from members_sumary m        
    where m.branch_id = isnull(b.id, @branch)        
     and m.program_id = isnull(p.id, @program)        
     and m.month_id >= @month      
   )        
        
  insert into members_sumary([week_id], branch_id, program_id, people,         
 financial_issues, scheduling_issues, comunication_issues)        
  select @week, b.id, p.id, 0, 0, 0, 0        
  from branch b, program p        
  where        
   b.id = isnull(b.id, @branch)         
   and p.id = isnull(p.id, @program)         
   and b.active = 1        
   and not exists (        
    select 1 from members_sumary m        
    where m.branch_id = isnull(b.id, @branch)        
     and m.program_id = isnull(p.id, @program)        
     and m.week_id = @week      
   )        
      
        
 /*update ms set ms.people = t.people,         
  ms.comunication_issues = t.comunication,         
  ms.financial_issues = t.financial,        
  ms.scheduling_issues = t.scheduling */        
          
 update ms set ms.people = t.people,         
   ms.comunication_issues = t.comunication,         
   ms.financial_issues = t.financial,        
   ms.scheduling_issues = t.scheduling        
 from members_sumary ms        
  join (        
    select pp.id program_id, b.id branch_id,          
     (select count(1) 
		from person p (nolock)           
		where p.program_id = pp.id and p.branch_id = b.id 
			and p.is_active_member = 1) people,          
     (select count(1)           
		from person p (nolock) where p.program_id = pp.id and p.branch_id = b.id        
			and p.is_active_member = 1
			and financial_status > 0 and financial_status != 3 and free_financial = 0) financial,          
     (select count(1)           
		from person p (nolock) where p.program_id = pp.id and p.branch_id = b.id 
			and p.is_active_member = 1         
			and scheduling_status > 0 and scheduling_status != 3 and free_scheduling = 0) scheduling,          
     (select count(1)           
		from person p (nolock) where p.program_id = pp.id and p.branch_id = b.id  
			and p.is_active_member = 1      
			and comunication_status > 0 and comunication_status != 3) comunication          
    from program pp, branch b        
    where pp.id = isnull(@program, pp.id)              
		and b.id = isnull(@branch, b.id)        
  ) t on t.program_id = ms.program_id          
		and t.branch_id = ms.branch_id              
 where ms.branch_id = isnull(@branch, ms.branch_id)        
	and ms.program_id = isnull(@program, ms.program_id)        
	and ms.[date] >= @start_date           
	and (        
		ms.people != t.people         
		or ms.comunication_issues != t.comunication         
		or ms.financial_issues != t.financial        
		or ms.scheduling_issues != t.scheduling          
	)        
      
  update ms set ms.people = t.people,         
   ms.comunication_issues = t.comunication,         
 ms.financial_issues = t.financial,        
   ms.scheduling_issues = t.scheduling        
 from members_sumary ms        
  join (        
    select pp.id program_id, b.id branch_id,          
     (select count(1) from person p (nolock)           
     where p.program_id = pp.id and p.branch_id = b.id
	  and p.is_active_member = 1
	 ) people,          
     (select count(1)           
     from person p (nolock) where p.program_id = pp.id and p.branch_id = b.id
		and p.is_active_member = 1        
		and financial_status > 0 and financial_status != 3 and free_financial = 0) financial,          
     (select count(1)           
     from person p (nolock) where p.program_id = pp.id 
		and p.branch_id = b.id          
		and p.is_active_member = 1
		and scheduling_status > 0 and scheduling_status != 3 and free_scheduling = 0) scheduling,          
     (select count(1)           
     from person p (nolock) where p.program_id = pp.id and p.branch_id = b.id   
		and p.is_active_member = 1     
		and comunication_status > 0 and comunication_status != 3) comunication          
    from program pp, branch b        
    where pp.id = isnull(@program, pp.id)              
    and b.id = isnull(@branch, b.id)        
  ) t on t.program_id = ms.program_id          
   and t.branch_id = ms.branch_id              
 where ms.branch_id = isnull(@branch, ms.branch_id)        
  and ms.program_id = isnull(@program, ms.program_id)        
  and ms.month_id = @month      
  and (        
   ms.people != t.people         
   or ms.comunication_issues != t.comunication         
   or ms.financial_issues != t.financial        
   or ms.scheduling_issues != t.scheduling          
  )          
      
  
  update ms set ms.people = t.people,         
   ms.comunication_issues = t.comunication,         
   ms.financial_issues = t.financial,        
   ms.scheduling_issues = t.scheduling        
 from members_sumary ms        
  join (        
    select pp.id program_id, b.id branch_id,          
     (select count(1) from person p (nolock)           
     where p.program_id = pp.id and p.branch_id = b.id
		and p.is_active_member = 1) people,          
     (select count(1)           
     from person p (nolock) where p.program_id = pp.id and p.branch_id = b.id
		and p.is_active_member = 1        
		and financial_status > 0 and financial_status != 3 and free_financial = 0) financial,          
     (select count(1)           
     from person p (nolock) where p.program_id = pp.id and p.branch_id = b.id       
		and p.is_active_member = 1   
		and scheduling_status > 0 and scheduling_status != 3 and free_scheduling = 0) scheduling,          
     (select count(1)           
     from person p (nolock) where p.program_id = pp.id and p.branch_id = b.id        
		and comunication_status > 0 and comunication_status != 3
		and p.is_active_member = 1) comunication          
    from program pp, branch b        
    where pp.id = isnull(@program, pp.id)              
    and b.id = isnull(@branch, b.id)        
  ) t on t.program_id = ms.program_id          
   and t.branch_id = ms.branch_id              
 where ms.branch_id = isnull(@branch, ms.branch_id)        
  and ms.program_id = isnull(@program, ms.program_id)        
  and ms.week_id >= @week      
  and (        
   ms.people != t.people         
   or ms.comunication_issues != t.comunication         
   or ms.financial_issues != t.financial        
   or ms.scheduling_issues != t.scheduling          
  )          
      
end 

