
CREATE view vwPersonRelationships          
as          
select pr.*, p1.name indicated_by, p2.name indicated_name, rt.name relationship_description, 
	cs.name [current_step], c.due_date, cs.[order] current_step_number, 
	dbo.SecondsFromEpoch(c.due_date) due_date_ts
from person_relationship pr          
 join enum_relationship_type rt on rt.id = pr.relationship_type         
 join vwPerson p1 on p1.id = pr.person_id          
 join vwPerson p2 on p2.id = pr.person2_id  
 left join card c on c.id = pr.monitoring_card_id  
 left join card_step cs on cs.id = c.current_step_id