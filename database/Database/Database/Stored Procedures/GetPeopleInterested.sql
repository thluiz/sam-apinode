  
CREATE procedure [dbo].[GetPeopleInterested](  
 @branch int = null,
 @name varchar(150) = null,
 @people_per_page int = 50,      
 @page int = 1     
)  
as  
begin  
  if(@people_per_page is null)	
	set @people_per_page = 150

  if(@page is null)	
	set @page = 1

 if(not exists(select 1 from vwPerson p  
  left join incident i on i.id = p.next_incident_id  
  where p.is_interested = 1  
	and isnull(p.branch_id, -1) = isnull(@branch, isnull(p.branch_id, -1))
	and (@name is null or len(@name) <= 0 or (p.name like '%' + @name + '%' COLLATE Latin1_General_CI_AI ))))      
 begin       
  select CAST(1 as bit) [empty]      
  for json path  
  return      
 end      


 select p.*,
	(
	select * from person_comment pc 
	where pc.person_id = p.id and pc.archived = 0	
	for json path
	) commentaries
  from vwPerson p  
  left join incident i on i.id = p.next_incident_id  
  where p.is_interested = 1  
	and isnull(p.branch_id, -1) = isnull(@branch, isnull(p.branch_id, -1))
	and (@name is null or len(@name) <= 0 or (p.name like '%' + @name + '%' COLLATE Latin1_General_CI_AI ))
  ORDER BY isnull(i.date, dateadd(year, -1, getUTCdate())), name     
  OFFSET ((@page - 1) * @people_per_page) ROWS      
  FETCH NEXT @people_per_page ROWS ONLY      
  for json path   
  
end  

