CREATE procedure SaveIncidentActionComment(      
 @incident_action_id int,      
 @comment nvarchar(max),      
 @responsible_id int  = null      
)      
as      
begin      
      
 insert into incident_action_comment(incident_action_id, comment, created_by, created_at)       
 values (@incident_action_id, @comment, @responsible_id, getUTCdate())      
            
 select *     
 from vwIncidentAction
 where id = @incident_action_id    
 for json path     
    
end