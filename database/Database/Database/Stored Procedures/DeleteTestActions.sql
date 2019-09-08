

create procedure DeleteTestActions
as
begin

select id 
into #delete
from incident_action where title like 'teste%' and created_by = 4


delete from incident_action_comment where incident_action_id in (select id from #delete) 
delete from incident_action_incident where incident_action_id in (select id from #delete) 
delete from incident_action where id in (select id from #delete) 

drop table #delete

end