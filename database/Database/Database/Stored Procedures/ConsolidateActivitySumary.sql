CREATE procedure ConsolidateActivitySumary      
 @branch int = null,      
 @date date = null      
as      
begin       
      
 set @date = isnull(@date, cast(dbo.getCurrentDateTime() as date))        
    
 /********************************      
 CRIA OS REGISTROS BÁSICOS PARA ATUALIZAR NA SEQUENCIA      
 *********************************/         
      
 insert into activity_sumary([date], branch_id, activity_type)        
  select @date, b.id, eat.id      
  from enum_activity_type eat, branch b      
  where        
  b.id = isnull(b.id, @branch)          
  and b.active = 1        
  and not exists (        
   select 1 from activity_sumary s        
   where s.branch_id = isnull(b.id, @branch)           
    and s.[date] = @date        
    and s.activity_type = eat.id       
  )        
      
      
 /********************************      
 ATUALIZA ATIVIDADES COM CONTROLE SIMPLES (MPAs, Pagamentos/recebimentos, reuniões...)      
 *********************************/       
 update acs set       
  acs.expected = total.expected,      
  acs.not_treated = total.not_treated,      
  acs.treated = total.treated,      
  acs.unexpected = total.unexpected,      
  acs.closed = total.closed      
 from activity_sumary acs      
 join (      
  select activity_type, branch_id,       
   sum(expected) expected, sum(unexpected) unexpected, sum(closed) closed, sum(not_treated) not_treated, sum(treated) treated      
  from (      
	-- expected
    select eit.activity_type, i.branch_id, count(1) expected, 0 unexpected, 0 closed, 0 not_treated, 0 treated       
    from enum_incident_type eit      
     join incident i on i.incident_type = eit.id      
    where eit.activity_type is not null      
     and cast(i.date as date) = @date    
  and i.branch_id = isnull(@branch, i.branch_id)    
     and scheduled = 1      
     and cancelled = 0      
    group by eit.activity_type, branch_id       
   union all 
	-- unexpected     
    select eit.activity_type, i.branch_id, 0 expected, count(1) unexpected, 0 closed, 0 not_treated, 0 treated       
    from enum_incident_type eit      
     join incident i on i.incident_type = eit.id      
    where eit.activity_type is not null      
     and cast(i.date as date) = @date  
  and i.branch_id = isnull(@branch, i.branch_id)      
     and scheduled = 0      
     and cancelled = 0      
    group by eit.activity_type, branch_id      
   union all         
	-- closed
    select eit.activity_type, i.branch_id, 0 expected, 0 unexpected, count(1) closed, 0 not_treated, 0 treated       
    from enum_incident_type eit      
     join incident i on i.incident_type = eit.id      
    where eit.activity_type is not null      
     and cast(i.date as date) = @date      
	 and i.branch_id = isnull(@branch, i.branch_id)  
     and scheduled = 1      
     and closed = 1    
	 and treated = 0  
     and cancelled = 0      
    group by eit.activity_type, branch_id      
   union all         
    select eit.activity_type, i.branch_id, 0 expected, 0 unexpected, 0 closed, count(1) not_treated, 0 treated       
    from enum_incident_type eit      
     join incident i on i.incident_type = eit.id      
    where eit.activity_type is not null      
		and cast(i.date as date) = @date      
		and i.branch_id = isnull(@branch, i.branch_id)  
		and scheduled = 1      
		and closed = 0      
		and cancelled = 0      
		and treated = 0
		and [date] <= dbo.getCurrentDateTime()      
    group by eit.activity_type, branch_id      
   union all         
    select eit.activity_type, i.branch_id, 0 expected, 0 unexpected, 0 closed, 0 not_treated, count(1) treated       
    from enum_incident_type eit       join incident i on i.incident_type = eit.id      
    where eit.activity_type is not null      
     and cast(i.date as date) = @date    
  and i.branch_id = isnull(@branch, i.branch_id)    
     and scheduled = 1      
     and treated = 1      
     and cancelled = 0      
    group by eit.activity_type, branch_id      
  ) t      
  group by t.activity_type, t.branch_id       
 ) total on total.branch_id = acs.branch_id      
   and total.activity_type = acs.activity_type      
 where     
 acs.[date] = @date    
 and acs.branch_id = isnull(@branch, acs.branch_id)  
 and (acs.expected != total.expected       
   or acs.not_treated != total.not_treated      
   or acs.treated != total.treated      
   or acs.unexpected != total.unexpected      
   or acs.closed != total.closed)    
       
       
      
      
 /********************************      
 ATUALIZA OS CONTATOS      
 *********************************/       
      
 /********************************      
 ATUALIZA AS MATRICULAS      
 *********************************/       
      
 /********************************      
 ATUALIZA AS REUNIÕES      
 *********************************/       
       
      
 /********************************      
 CONSOLIDAÇÕES MENSAIS/SEMANAIS      
 *********************************/        
 exec ConsolidateWeeklyActivitySumary @branch, @date      
      
 exec ConsolidateMonthlyActivitySumary @branch, @date       
      
end      