          
CREATE procedure TreatIncidentAction(              
    @action_id int,              
    @incident_id int,               
    @treatment_type int,              
    @treatment_description nvarchar(max),              
    @treatment_date datetime,              
    @responsible_id int              
)              
as              
begin               
    declare @location_id int, @next_incident int, @gmt int, @treatment_date_in_utc datetime, @end_date_utc datetime            
                
    --if current incident is not set, treat action as it was in the last associated incident            
    if(@incident_id is null)             
        select @incident_id = max(iai.incident_id)            
        from incident_action_incident iai where iai.incident_action_id = @action_id            
            
    select @location_id = location_id, @gmt = tz.gmt_variation             
    from incident_action ia            
        join [location] l on l.id = ia.location_id            
        join timezone tz on tz.id = l.timezone_id            
    where ia.id = @action_id            
          
    select @end_date_utc = dateadd(hour, @gmt, end_date)             
    from incident           
    where id = @incident_id          
            
    set @treatment_date_in_utc = dateadd(hour, @gmt, @treatment_date)            
              
    select top 1 @next_incident = id            
    from incident             
    where incident_type = 36             
        and location_id = @location_id            
        and cancelled = 0         
        and id != @incident_id       
        and ((@treatment_type = 2 and dateadd(hour, @gmt, date) <= @treatment_date_in_utc)    
            or (@treatment_type = 1 and dateadd(hour, @gmt, date) >= @end_date_utc)    
        )                    
        and (end_date is null or dateadd(hour, @gmt, end_date) >= case when @treatment_type = 1 then @end_date_utc else @treatment_date_in_utc end)     
    order by date                 
              
    insert into incident_action_comment(incident_action_id, comment, created_by, created_at, comment_type)              
    values (@action_id, @treatment_description, @responsible_id, GETUTCDATE(), 1)            
                        
    update iai set iai.treated = 1, iai.treated_at = GETUTCDATE(), iai.treated_by = @responsible_id            
    from incident_action_incident iai              
    where iai.incident_action_id = @action_id and iai.incident_id = @incident_id              
            
    if(@treatment_date is not null)            
        update incident_action set treated_until = @treatment_date_in_utc where id = @action_id            
            
    if(@next_incident is not null       
        and not exists(select 1       
                        from incident_action_incident       
                        where incident_id = @next_incident and incident_action_id = @action_id)      
    )            
        insert into incident_action_incident(incident_id, incident_action_id)             
        values (@next_incident, @action_id)                
              
    select *               
    from vwIncidentAction where id = @action_id              
    for json path                      
            
end