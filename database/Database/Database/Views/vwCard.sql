-- drop view vwCard          
create view vwCard          
with schemabinding          
as          
select c.id, c.title, c.due_date,          
 left(CONVERT(VARCHAR, c.due_date, 103), 5) due_date_formated, c.created_on,          
 convert(char(5), c.due_date, 108) due_time_formated,          
 c.leader_id, c.[description],          
 c.parent_id, parent.title parent_title,          
 parent.parent_id high_level_id, high_level.title high_level_title, high_level.abrev high_level_abrev,          
 c.archived, c.cancelled,          
 c.location_id, c.abrev, c.[order], c.current_step_id, cs.[name] current_step,          
 c.card_template_id template_id, ct.is_task,          
 c.has_overdue_card, c.closed,          
 (select l.id, l.name, l.avatar_img, l.avatar_md, l.avatar_sm, l.avatar_esm        
 from dbo.vwPerson l (nolock) where l.id = c.leader_id for json path) leaders,          
 (select l_parent.id, l_parent.name, l_parent.avatar_img, l_parent.avatar_md, l_parent.avatar_sm, l_parent.avatar_esm                  
 from dbo.vwPerson l_parent (nolock) where l_parent.id = parent.leader_id for json path) parent_leaders,          
 (select pc.person_id, p.name, p.avatar_img, p.avatar_md, p.avatar_sm, p.avatar_esm, p.kf_name_ideograms, p.contacts,          
 pc.[order], p.scheduling_description, p.financial_description, p.financial_status,          
 p.comunication_status, p.data_status, p.vouchers,  p.scheduling_status,         
 p.offering_status, p.offering_status_description,         
 isnull(pc.position_description, pcp.name) position_description, p.pinned_comment_count,  p.pinned_comments,          
 pc.position,          
 cast((case when          
 exists(select 1          
  from dbo.[card] children  (nolock)          
  join dbo.person_card pc (nolock) on pc.card_id = children.id          
  where children.parent_id = c.id and person_id = p.id)          
  then 1 else 0 end) as bit) has_tasks          
  from dbo.person_card pc (nolock)          
   join dbo.vwPerson p (nolock) on pc.person_id = p.id          
   join dbo.person_card_position pcp (nolock) on pcp.id = pc.position          
  where pc.card_id = c.id          
 and pc.position != 6          
  order by pc.[order]          
  for json path          
 ) people,          
 (select pc.person_id, p.name, p.avatar_img, p.avatar_md, p.avatar_sm, p.kf_name_ideograms, p.contacts,          
 pc.[order], p.scheduling_description, p.financial_description, p.financial_status,          
 p.comunication_status, p.data_status, p.scheduling_status,          
 isnull(pc.position_description, pcp.name) position_description, pc.position, p.vouchers,          
 p.pinned_comment_count, p.pinned_comments,        
 p.offering_status, p.offering_status_description        
  from dbo.person_card pc (nolock)          
   join dbo.vwPerson p (nolock) on pc.person_id = p.id          
   join dbo.person_card_position pcp (nolock) on pcp.id = pc.position          
  where pc.card_id = c.id          
 and pc.position = 6          
  order by pc.[order]          
  for json path          
 ) supporters,          
 (          
  select cs.id, cs.name, cs.is_blocking_step, cs.automatically_move,          
   (          
    select count(1)          
  from dbo.[card] (nolock)          
     where parent_id = c.id          
  and current_step_id = cs.id          
  and cancelled = 0          
  and archived = 0          
   ) childrens          
  from dbo.card_step cs  (nolock)          
  where cs.card_id = c.id          
  and archived = 0          
  order by [order]          
  for json path          
 ) steps_description,          
 (select id, title from dbo.[card] parent2 (nolock) where parent2.id = c.id for json path) parent,          
 (select count(1) from dbo.card_commentary cc (nolock) where cc.card_id = c.id and archived = 0) comment_count,          
 (select l.id, l.name from dbo.[location] l (nolock) where l.id = c.location_id for json path) locations,          
 organization.id organization_id,          
 c.automatically_generated,          
 (select pr.person_id indicator, pr.relationship_type,          
  pr.identifier, ert.name relationship_description          
 from dbo.person_relationship pr (nolock)          
  join dbo.enum_relationship_type ert (nolock) on ert.id = pr.relationship_type          
 where pr.monitoring_card_id = c.id for json path) relationships       
from dbo.[card] c (nolock)          
 join dbo.card_template ct (nolock) on ct.id = c.card_template_id          
 left join dbo.card_step cs (nolock) on cs.id = c.current_step_id          
 left join dbo.[card] parent (nolock) on parent.id = c.parent_id          
 left join dbo.[card] high_level (nolock) on high_level.id = parent.parent_id          
 left join dbo.[card] organization (nolock) on organization.id = high_level.parent_id    
  
   