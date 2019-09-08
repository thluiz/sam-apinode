    
CREATE procedure [dbo].[TogleIncidentCommentArchived](    
 @comment_id int    
) as    
begin    
    
 update incident_comment set archived = case when archived = 1 then 0 else 1 end    
 where id = @comment_id    
    
 declare @incident_id int = (select incident_id from incident_comment where id = @comment_id)    
    
 exec UpdateIncidentCommentCount @incident_id    
    
 select *       
 from vwLightIncident       
 where id = @incident_id      
 for json path       
end