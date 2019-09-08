CREATE procedure [dbo].[GetOrganizations](@user int = null, @show_archived bit = 0,     
@organization_id int = null, @include_childrens bit = 0)          
as          
begin          
    
 if(not exists(select 1 from [card] c          
 where (@show_archived = 1 or archived = 0)          
 and parent_id is null          
 and c.id = isnull(@organization_id, c.id)))    
 begin      
  select cast(1 as bit) empty    
  for json path    
  return    
     
 end    
    
          
 select *,          
 (select pc.person_id, p.name, p.avatar_img, pc.[order],           
	isnull(pc.position_description, pcp.name) position_description,           
	pc.position,      
	cast((case when       
	exists(select 1       
		from [card] children       		
		where children.parent_id = c.id and children.leader_id = p.id
			and cancelled = 0 and archived = 0)      
		then 1 else 0 end) as bit) has_tasks   
  from person_card pc          
   join vwPerson p on pc.person_id = p.id          
   join person_card_position pcp on pcp.id = pc.position          
  where pc.card_id = c.id          
  order by pc.[order]        
  for json path          
 ) people,    
 (    
 select * from vwCard     
  where parent_id = c.id     
  and cancelled = 0    
  and (@show_archived = 1 or archived = 0)      
 for json path
 ) childrens           
 from [card] c          
 where (@show_archived = 1 or archived = 0)          
  and parent_id is null          
  and c.id = isnull(@organization_id, c.id)          
 order by [order]         
 for json path          
          
          
end 