CREATE procedure CheckPeopleComunicationStatus(@person int = null)  
as  
begin  
  
	update p set comunication_status = 1  
	 from person p  
	 where   
	  p.comunication_status = 0  
	  and p.id = isnull(@person, p.id)  
	  and (exists(  
	   select pic.person_id  
	   from incident i  
		join person_incident pic on pic.incident_id = i.id  
	   where incident_type = 5   
		and treated = 0   
		and i.closed = 0   
		and i.cancelled = 0   
		and pic.person_id = p.id 
		and i.[date] < dbo.getCurrentDateTime()
	   ) or exists (  
		select 1  
		from [card] c  
		 join person_card pc on c.id = pc.card_id  
		where pc.person_id = p.id  
		 and pc.position = 5  
		 and closed = 0   
		 and cancelled = 0  
		 and archived = 0  
		 and not exists(  
		  select 1 from [card] parent       
		  where parent.id = c.parent_id  
		  and (closed_on = 1  
		   or cancelled = 1  
		   or archived = 1)  
		 )  
		 and not exists(  
		  select 1 from [card] parent  
		  join [card] grand_parent on grand_parent.id = parent.parent_id       
		  where parent.id = c.parent_id  
		  and (grand_parent.closed_on = 1  
		   or grand_parent.cancelled = 1  
		   or grand_parent.archived = 1)  
		 )     
	   )  
	  )  
  
	 update p set comunication_status = 0  
	 from person p  
	 where   
	  p.comunication_status = 1  
	  and p.id = isnull(@person, p.id)  
	  and not (  
	  (exists(  
	   select pic.person_id  
	   from incident i  
		join person_incident pic on pic.incident_id = i.id  
	   where incident_type = 5   
		and treated = 0   
		and i.closed = 0   
		and i.cancelled = 0   
		and pic.person_id = p.id  
		and i.[date] < dbo.getCurrentDateTime()
	   ) or exists (  
		select 1  
		from [card] c  
		 join person_card pc on c.id = pc.card_id  
		where pc.person_id = p.id  
		 and pc.position = 5  
		 and closed = 0   
		 and cancelled = 0  
		 and archived = 0  
		 and not exists(  
		  select 1 from [card] parent       
		  where parent.id = c.parent_id  
		  and (closed_on = 1  
		   or cancelled = 1  
		   or archived = 1)  
		 )  
		 and not exists(  
		  select 1 from [card] parent  
		  join [card] grand_parent on grand_parent.id = parent.parent_id       
		  where parent.id = c.parent_id  
		  and (grand_parent.closed_on = 1  
		   or grand_parent.cancelled = 1  
		   or grand_parent.archived = 1)  
		 )     
	   )  
	  )  
	 )  
  
end