  
CREATE procedure UpdateIncidentCommentCount(  
 @incident_id int  
)  
as  
begin  
   
 update i set comment_count = (  
  select count(1) from incident_comment ic   
  where incident_id = @incident_id  
   and archived = 0  
 )  
 from incident i  
 where i.id = @incident_id  
  
end