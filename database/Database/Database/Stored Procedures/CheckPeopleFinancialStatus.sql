create procedure CheckPeopleFinancialStatus(@person int = null)
as
begin

	declare @people_financial_status table (person_id int, [status] int)                              
                                                   
	 -- people without scheduled payment                                
	 insert into @people_financial_status(person_id, [status])                              
	  select p.id, 1                              
	  from person p                              
	  where (p.is_active_member = 1 or p.is_leaving = 1)                  
	   and p.id not in (select distinct pic.person_id from person_incident pic                               
		   join incident i on pic.incident_id = i.id                              
		   where i.incident_type = 24                           
	  and i.cancelled = 0                             
	  and i.treated = 0  
			and i.date > getUTCdate()                              
		)                               
                                                    
	 -- people with old payments not closed and not treated                              
	 insert into @people_financial_status(person_id, [status])                              
	  select p.Id, 2                              
	  from person p                              
	  where p.id = isnull(@person, p.id)                              
	 and (p.is_active_member = 1 or p.is_leaving = 1)                  
	 and p.id in (select distinct pic.person_id from person_incident pic                               
		join incident i on pic.incident_id = i.id                              
		join enum_incident_type eit on eit.id = i.incident_type      
		  where  eit.financial_type > 0      
		and i.closed = 0          
		and pic.person_id = isnull(@person, p.id)                        
		and i.treated = 0                           
		and i.cancelled = 0                           
		and i.date < getUTCdate()                              
	   )                              
                                 
	 update ps set [status] = 4                              
	 from @people_financial_status ps                              
	 where exists(select 1 from @people_financial_status ps2 where ps.person_id = ps2.person_id and [status] = 1)                              
	   and exists(select 1 from @people_financial_status ps2 where ps.person_id = ps2.person_id and [status] = 2)                              
                              
	 update p set financial_status = pfs.[status]                              
	 from person p                               
	  join @people_financial_status pfs on pfs.person_id = p.id                              
                              
	 update p set financial_status = 0                              
	 from person p                               
	 where not exists(select 1 from @people_financial_status pfs where pfs.person_id = p.id)                             
	 and p.id = isnull(@person, p.id)
	 
	                               
	update p set financial_status = 0                           
	from person p                          
	where free_financial = 1                          
	and p.Id = isnull(@person, p.id)           

end