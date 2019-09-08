      
CREATE procedure [dbo].[GetSumary](                                  
 @week_modifier int = 0,                                  
 @month_modifier int = 0,
 @branch int = null,                
 @date date = null                                  
)                                        
as                                        
begin                                        
	if(@date is null)
		set @date = getUTCdate()       
	   
	                                                      
	declare @week int = (select id 
						from [week] 
						where [start] <= DATEADD(week, @week_modifier, dbo.getCurrentDate())
							and [end] >= DATEADD(week, @week_modifier, dbo.getCurrentDate()))
 
	declare @month int = (select id 
						from [month] 
						where [start] <= DATEADD(month, @month_modifier, dbo.getCurrentDate())
							and [end] >= DATEADD(month, @month_modifier, dbo.getCurrentDate()))
                                        
	declare @sumary table(program varchar(20), people int, comunications int, financial int, scheduling int)       

	insert into @sumary(program, people,                 
						financial, scheduling, comunications)                  
		select pp.[name] program, sum(ms.people),                 
						sum(ms.financial_issues), sum(ms.scheduling_issues), sum(ms.comunication_issues)                   
		from program pp                    
			join members_sumary ms on ms.program_id = pp.id                
		where ms.branch_id = isnull(@branch, ms.branch_id)                
			and ms.month_id = @month
		group by pp.[name]               
                    
	insert into @sumary(program, people, financial, scheduling, comunications)                  
		select 'Total', sum(people), sum(financial), sum(scheduling), sum(comunications)                  
		from @sumary    		              

	select 
			(select eat.id, eat.[name], eat.[close_group], eat.obrigatory,
			(
			select closed, not_treated, treated, expected, unexpected
			from (
				select 1 [order], sum(expected) expected, sum(s.unexpected) unexpected, sum(s.closed) closed, sum(s.treated) treated, sum(s.not_treated) not_treated
				from activity_sumary s	
				where s.branch_id = isnull(@branch, s.branch_id)
					and s.[date] = @date
					and s.activity_type = eat.id
				union all
					select 2, sum(expected) expected, sum(s.unexpected) unexpected, sum(s.closed) closed, sum(s.treated) treated, sum(s.not_treated) not_treated
					from activity_sumary s	
					where s.branch_id = isnull(@branch, s.branch_id)
						and s.[week_id] = @week
						and s.activity_type = eat.id
				union all 
					select 3, sum(expected) expected, sum(s.unexpected) unexpected, sum(s.closed) closed, sum(s.treated) treated, sum(s.not_treated) not_treated
					from activity_sumary s	
					where s.branch_id = isnull(@branch, s.branch_id)
						and s.month_id = @month
						and s.activity_type = eat.id) t
			order by [order]
			for json path) activity
		from enum_activity_type eat
		order by eat.[order]
		for json path
	) sumary, 
	(select * from @sumary for json path) members_sumary,
	(select * from branch where active = 1 for json path) branches,	
	convert(VARCHAR(10), @date, 103) current_date_text,	
	(select cast(number as varchar(2)) + '/' + cast(DATEPART(year, [start]) as varchar(4))
		from [week] where id = @week) current_week_text, 
	(select cast([month] as varchar(2)) + '/' + cast([year] as varchar(4))
		from [month] where id = @month) current_month_text
	for json path
                                                                     
end 


