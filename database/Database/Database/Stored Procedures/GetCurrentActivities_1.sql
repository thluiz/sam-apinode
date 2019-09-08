    
CREATE procedure GetCurrentActivities(      
 @branch_id int = null      
)      
as      
begin      
  
	if(not exists(select 1    
			  from incident i (nolock)   
			   join enum_incident_type eit (nolock) on eit.id = i.incident_type and eit.need_to_be_started = 1  
			  where   
				started_on is not null      
				and closed = 0
				and i.treated = 0       
				and i.cancelled = 0  
				and i.branch_id =  ISNULL(@branch_id, i.branch_id)))
	begin		
		return 
	end
    
         
	select *
	from vwLightIncident i  (nolock)     
	where i.id in (    
		select id 
		from incident i2
		where i2.started_on is not null      
			and i2.closed = 0         
			and i2.treated = 0       
			and i2.cancelled = 0  
			and i2.branch_id =  ISNULL(@branch_id, i2.branch_id)
	)    
	order by case when i.incident_type = 36 then 0 when i.incident_type = 39 then 1 else 2 end, i.started_on      
	for json path    
        
end