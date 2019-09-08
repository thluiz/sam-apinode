
create procedure GetKungFuFamilies
as
begin
	select p2.id, p2.avatar_img, p2.name master_name,           
	  pa.alias [name], pa.ideograms family_ideograms              
	 from person p2          
	  join person_role pr2 on pr2.person_id = p2.id            
	  join person_alias pa on pa.person_id = p2.id          
	 where pr2.role_id = 9           
	  and pa.kungfu_name = 1           
	 for json path              
end