-- [GetPersonOfferingAvailable] @save_data = 1
        
CREATE procedure [dbo].[GetPersonOfferingAvailable](@person_id int = null, @save_data bit = 0)                  
as                  
begin                  
                  
  declare @data_status_description table (person_id int, [description] varchar(100), missing_code varchar(30), [status] int)                          
               
        
  insert into @data_status_description(person_id, [description], missing_code, [status])                          
   select p.id, 'Possui Convites ou Indicações disponíveis', 'AVAILABLE_INDICATIONS', 1                          
   from person p         
   where branch_id is not null                          
    and p.is_active_member = 1           
    and p.Id = isnull(@person_id, p.id)       
 and not exists(select 1 from person_role pr where pr.person_id = p.id and pr.role_id = 9)        
    and (not exists(        
     select 1         
     from person_relationship pr        
     where pr.person_id = p.id        
   and pr.relationship_type = 10          
   and pr.person_id = isnull(@person_id, pr.person_id)         
     group by pr.person_id         
     having COUNT(1) >= (select cast(value as  int) from configuration where id = 1)        
     )       
  or     
  not exists(        
     select 1         
     from person_relationship pr        
     where pr.person_id = p.id        
   and pr.relationship_type in (13, 14)    
   and pr.person_id = isnull(@person_id, pr.person_id)         
     group by pr.person_id         
     having COUNT(1) >= (select cast(value as  int) from configuration where id = 2)        
     )     
   )     
  
   insert into @data_status_description(person_id, [description], missing_code, [status])                          
   select p.id, 'Indicações ou Convites com pendências', 'PENDING_INDICATIONS', 2                          
   from person p         
   where branch_id is not null                          
    and p.is_active_member = 1           
    and p.Id = isnull(@person_id, p.id)       
 and not exists(select 1 from person_role pr where pr.person_id = p.id and pr.role_id = 9)        
    and exists(        
     select 1         
  from person_relationship pr        
   join card c on c.id = pr.monitoring_card_id  
   join card_step cs on cs.id = c.current_step_id  
  where pr.person_id = p.id               
   and pr.person_id = isnull(@person_id, pr.person_id)                      
   and c.due_date <= getUTCdate()     
   and cs.[order] = 1  
     )   
                          
  if(@save_data = 1)                  
  begin                  
   update p set offering_status = s.[status], offering_status_description = stuff(                          
      (select ', ' + [description]           
		   from @data_status_description                          
		   where person_id = p.id                          
			  For XML PATH ('')), 1, 2, ''                          
     )                          
   from person p
   join (select s.person_id, max([status]) [status] from @data_status_description s group by person_id) s on s.person_id = p.id                              
	where                         
		p.id = ISNULL(@person_id, p.id) 
		and p.offering_status != s.[status]                         			
			                        
	update p set offering_status = 0, offering_status_description = ''                                   
	from person p                                  
	where p.Id = isnull(@person_id, p.id)                        
		and p.offering_status != 0  
		and not exists(select 1 from @data_status_description d where d.person_id = p.id)  	              
 end                  
 else                  
 begin                  
  if(not exists(select 1 from @data_status_description))                  
	begin                  
		select CAST(1 as bit) [empty]                  
		for json path                  
                  
		return 
	end                  
                  
  select person_id, [description], missing_code, [status] 
  from @data_status_description d1
  where [status] = (select max([status]) from @data_status_description d2 where d2.person_id = d1.person_id)                 
  for json path                  
 end                  
end