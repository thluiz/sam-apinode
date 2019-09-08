CREATE procedure [dbo].[GetCommentsAboutPerson](        
 @person_id int,        
 @comments_per_page int = 50,        
 @page int = 1,        
 @show_archived bit = 0        
)        
as        
begin        
  
 select pc.id, pc.comment, pc.pinned, pc.responsible_id, pc.created_at, isnull(p.alias, p.name) responsible,        
  CONVERT (VARCHAR, pc.created_at, 103) created_date_br,        
  convert(char(5), pc.created_at, 108) created_hour_br        
 from person_comment pc        
 left join  person p on p.id = pc.responsible_id    
 where pc.person_id = @person_id        
 and (@show_archived = 1 or archived = 0)      
 ORDER BY pc.pinned, pc.created_at        
 OFFSET ((@page - 1) * @comments_per_page) ROWS        
 FETCH NEXT @comments_per_page ROWS ONLY        
 for json path        
        
end