CREATE procedure [dbo].[GetIncidentComments](      
 @incident_id int,      
 @comments_per_page int = 10,      
 @page int = 1,      
 @show_archived bit = 0      
)      
as      
begin      
      
 if(not exists(select 1 from incident_comment ic where ic.incident_id = @incident_id and archived = 0))      
 begin      
  select cast(1 as bit) empty for json path      
  return      
 end      
      
 select ic.id, ic.comment, ic.responsible_id, ic.created_at,       
  left(CONVERT (VARCHAR, ic.created_at, 103), 5) created_date_br,      
  convert(char(5), ic.created_at, 108) created_hour_br,
  p.name responsible      
 from incident_comment ic      
	left join person p on p.id = ic.responsible_id  
 where ic.incident_id = @incident_id      
 and (@show_archived = 1 or archived = 0)    
 ORDER BY ic.created_at      
 OFFSET ((@page - 1) * @comments_per_page) ROWS      
 FETCH NEXT @comments_per_page ROWS ONLY      
 for json path      
      
end