                              
CREATE procedure [dbo].[GetDailyMonitor2](                                                                                    
 @week_modifier int = 0,                                                                                    
 @branch int = null,                                                                   
 @display int = 0, /* 0 = week, 1 = day, 2 = month */                          
 @display_modifier int = 0,                          
 @start_date date = null,                                                                                    
 @end_date date = null,                          
 @date date = null                          
)                                                                                          
as                                                                                          
begin                                                                                          
                           
 if(@start_date is null and @end_date is null)                          
 begin                          
  if(@display = 0)                          
  begin                                                     
  if(@week_modifier != 0 and @display_modifier = 0)                          
   set @display_modifier = @week_modifier                          
                                                                        
  set @start_date = isnull(@start_date, DATEADD(WEEK, @display_modifier, DATEADD(d, -datepart(w, dbo.getCurrentDate())+2, dbo.getCurrentDate())))                                                                                           
  set @end_date = isnull(@end_date, DATEADD(WEEK, @display_modifier,cast(DATEADD(d, 8-datepart(w, dbo.getCurrentDate()), dbo.getCurrentDate()) as date)))                                                                                          
  end                          
  else if(@display = 1)                          
  begin                          
  set @start_date = isnull(@start_date, DATEADD(day, @display_modifier, dbo.getCurrentDate()))                           
  set @end_date = isnull(@end_date, @start_date)                                
  end                                            
  else if(@display = 2)                          
  begin                          
  declare @current_date date = DATEADD(month, @display_modifier, dbo.getCurrentDate())                          
  declare @month int = datepart(MONTH, @current_date)                          
  declare @year int = datepart(year, @current_date)                          
  declare @last_day_of_month date = dateadd(day, -1, dateadd(month, 1, DATEFROMPARTS(@year, @month, 1)))                          
                          
  select @last_day_of_month                          
                          
  set @start_date = isnull(@start_date, DATEFROMPARTS(@year, @month, 1))                                                                                           
  set @end_date = isnull(@end_date, @last_day_of_month)                                                                                          
  end                           
 end                          
                          
 declare @dates table([date] date, [current] bit)                                                                                          
                                                        
 declare @people table([name] varchar(300), domain varchar(100), domain_id int, branch_id int,                                   
 branch_abrev varchar(30), branch_initials varchar(3),                                  
 person_id int, n int, financial_status int not null default 0, financial_description varchar(max),                                                         
 scheduling_status  int not null default 0, scheduling_description varchar(max), avatar_img varchar(100),                                                        
 program_id int, comunication_status int not null default 0, comunication_description varchar(max),                                                    
 kf_name varchar(100), kf_name_ideograms nvarchar(100), family_abrev varchar(10),                                
 is_disciple bit, is_leaving bit, is_inactive_member bit, admission_date date,                       
 data_status bit not null default 0, data_status_description varchar(max), has_birthday_this_month bit not null default 0,            
 birth_date datetime default getUTCdate(), is_interested bit not null default 0, is_service_provider  bit not null default 0,           
 is_associated_with_member  bit not null default 0, is_external_member  bit not null default 0,    
 p1_sessions_current_month int default 0, contracted_p1_sessions  int default 0, pinned_comment_count int default 0,
 offering_status bit default 0, offering_status_description varchar(max) 
 )                                  
                 
 select *                         
 into #incidents                        
 from vwLightIncident i  (nolock)                                        
 where i.id in (      
 select id from incident i2 (nolock)      
 where  i2.date between @start_date and dateadd(day, 1, @end_date)                                                                                  
  and i2.branch_id = isnull(@branch, i2.branch_id)                                                           
  and i2.cancelled = 0)                                                   
                                                              
 insert into @dates                                                               
  select [date], case when DATEPART(w, [date]) = datepart(w, dbo.getCurrentDate()) then 1 else 0 end                                   
  from DateRange('d', @start_date, @end_date)                                                                                          
                                                                                                   
 insert into @people(                                                        
  [name], domain, domain_id,                                                         
  person_id, financial_status, financial_description,                                                         
  scheduling_status, scheduling_description, avatar_img,                                                        
  program_id, comunication_status, comunication_description,                                                        
  kf_name, kf_name_ideograms,                                 
  branch_id, branch_abrev, branch_initials,                                   
  family_abrev, is_disciple, is_leaving, is_inactive_member,                               
  admission_date, data_status, data_status_description,                
  has_birthday_this_month, birth_date,          
  is_interested, is_service_provider,           
  is_associated_with_member, is_external_member,    
  p1_sessions_current_month, contracted_p1_sessions, pinned_comment_count,
  offering_status, offering_status_description
 )                                                                                                                                           
 select [name],                                                                                          
  [domain], [domain_id], id,                                                                                                                                                       
  financial_status, [financial_description],                                                                                         
  scheduling_status, [scheduling_description],                                                                                      
  avatar_img, program_id,                                                                                   
  comunication_status, comunication_description,                                                                      
  kf_name, kf_name_ideograms,                                
  branch_id, branch_abrev, branch_initials,                                
  family_abrev, is_disciple, is_leaving, is_inactive_member,                                    
  admission_date, data_status, data_status_description,  
  has_birthday_this_month, birth_date,          
  is_interested, is_service_provider,           
  is_associated_with_member, is_external_member,    
  p.p1_sessions_current_month, p.contracted_p1_sessions, p.pinned_comment_count,
  p.offering_status, p.offering_status_description  
 from vwPerson  p   (nolock)                            
 where p.id in (       
  select p2.id       
  from person p2 (nolock)      
   join branch b (nolock) on b.id = p.branch_id       
  where b.active = 1                                                                                    
   and p2.is_active_member = 1          
   and p2.branch_id = isnull(@branch, p2.branch_id)      
 )                           
                                                         
                         
 insert into @people(person_id, [name], avatar_img, branch_id, branch_abrev,            
  financial_status, financial_description,                                                         
  scheduling_status, scheduling_description,            
  comunication_status, comunication_description,            
  data_status, data_status_description,          
  is_interested, is_service_provider,           
  is_associated_with_member, is_external_member,  
  is_inactive_member , pinned_comment_count,
  offering_status, offering_status_description            
 )                                                        
   select p2.id, p2.[name], avatar_img, isnull(p2.branch_id, -1), isnull(p2.branch_abrev, ''),            
  financial_status, financial_description,                                                         
  scheduling_status, scheduling_description,            
  comunication_status, comunication_description,            
  data_status, data_status_description,          
  p2.is_interested, p2.is_service_provider,           
  p2.is_associated_with_member, p2.is_external_member,  
  p2.is_inactive_member, pinned_comment_count,
  p2.offering_status, p2.offering_status_description                                                      
 from vwPerson p2  (nolock)                                                                                         
 where p2.id in (      
 select p.id from person p (nolock)      
  join #incidents i (nolock) on i.person_id = p.id                                                           
 where       
  -- pessoa sem núcleo e com atividade nesse núcleo ou pessoa com núcleo mas diferente do atual      
  (((p.branch_id is null) or (p.branch_id != isnull(@branch, p.branch_id)))          
  -- pessoas externas      
  or (      
   p.branch_id = isnull(@branch, p.branch_id)           
   and (          
    p.is_interested = 1          
    or p.is_service_provider = 1          
    or p.is_associated_with_member = 1           
    or p.is_external_member = 1            
    or p.is_inactive_member = 1           
    or p.is_leaving = 1)           
  ))            
 )                                                         
                                                           
                                 
 select *                       
 into #columns                                                                                          
 from (                                                                                           
  select LEFT(CONVERT(VARCHAR(15), [date], 103), 5) + ' - ' + (                     
 SELECT  CASE DATEPART(WEEKDAY,[date])                                                                                          
  WHEN 1 THEN 'D'                                                                 
  WHEN 2 THEN '2a'                                                                                        
  WHEN 3 THEN '3a'                                                                                         
  WHEN 4 THEN '4a'                                                                                       
  WHEN 5 THEN '5a'                                                    
  WHEN 6 THEN '6a'                                                                                         
  WHEN 7 THEN 'S'                                                                                         
 END                                                                                          
  )as [name], null prop, [date], [current]                                              
  from @dates         
 ) c                                                                                          
 order by [date]                                                                                            
                                                                            
 select (                                                                                          
  select [name], [domain], person_id, [domain_id],                                                                                           
  financial_status, [financial_description],                                                                                         
  scheduling_status, [scheduling_description],                                                                                      
  avatar_img, program_id, kf_name,                                                                  
  comunication_status, comunication_description,                                                   
  branch_abrev, branch_id, kf_name_ideograms,                                 
  branch_initials, family_abrev family_name,                                
  is_disciple, is_leaving, is_inactive_member,                              
  admission_date, data_status, data_status_description, has_birthday_this_month,          
  person_id id,          
  is_interested, is_service_provider,           
  is_associated_with_member, is_external_member,     
  p1_sessions_current_month, contracted_p1_sessions, pinned_comment_count                       
   from @people         
   order by isnull(admission_date, DATEADD(year, 1, getUTCdate())), birth_date desc                                                                                 
   for json path                                                                            
 ) [people],                                                                                           
 (                                                                                          
  select * from #columns  (nolock)                                                              
   for json path                                                                                          
 ) [week_days],                                                                                          
  (                                                                                          
  isnull((select *                      
  from #incidents   (nolock)                                                                     
  order by date                                                                                       
  for json path), (select cast(1 as bit) [empty] for json path))                                                            
 ) [incidents],                                                                       
 (                                                                                          
  select d.*, p.long_name program                                                                
  from domain d   (nolock)                                                                      
 join program p  (nolock) on d.program_id = p.id                                                                                     
  where       
 exists(select 1 from person p (nolock)                                                            
  join person_incident i  (nolock) on i.person_id = p.id                                                                                     
    where p.domain_id = d.id                                                                        
  and p.is_active_member = 1          
  and p.branch_id = isnull(@branch, p.branch_id))                                        
 order by [order]                                                                                        
  for json path                                                                         
 ) [domains],                                        
 (                                     
  select *                                                                                    
  from branch   (nolock)                                                              
  where active = 1                                                                                        
  for json path                                                                                          
 ) [branches],                                                                      
 (                   
  select                                              
  (LEFT(CONVERT(VARCHAR(15), @start_date, 103), 5) +                      
  case when @display = 1 then ''                       
  else                                                                                   
  ' - '                                                                                     
  + LEFT(CONVERT(VARCHAR(15), @end_date, 103), 5)                      
  end) [range],                                               
  cast((case when dbo.getCurrentDate() >= @start_date and dbo.getCurrentDate() <= @end_date then 1 else 0 end) as bit) [current]                                              
  for json path                                              
 ) selected_week,                                              
 isnull(@branch, -1) branch,                                                                            
 (           
  select *       
  from vwIncidentType  (nolock)                                                                         
  order by [order]                                                                            
  for json path                                                                            
 ) incident_types                            
 for json path                                                                                          
                                                                                                              
 drop table #columns                                                                                          
 drop table #incidents                                 
                           
                                                                                          
end