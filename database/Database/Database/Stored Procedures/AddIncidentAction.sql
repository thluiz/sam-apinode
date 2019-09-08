
CREATE procedure AddIncidentAction(  
@incident_id int,   
@title nvarchar(200),  
@description nvarchar(max),  
@responsible_id int,   
@type int = 1  
)  
as  
begin  
    declare @location_id int

    select @location_id = location_id from incident where id = @incident_id

    insert into incident_action(  
        title, [description], incident_action_type, created_by, location_id 
    ) values(  
        @title, @description, @type, @responsible_id, @location_id
    )  
  
    declare @incident_action_id int = @@identity  
  
    insert into incident_action_incident(  
        incident_id, incident_action_id  
    ) values (  
        @incident_id, @incident_action_id      
    )  
  
    select *, @incident_id incident_id  
    from vwIncidentAction  
    where id = @incident_action_id  
    for json path  
  
end