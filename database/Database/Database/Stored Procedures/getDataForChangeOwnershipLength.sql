CREATE procedure getDataForChangeOwnershipLength(
    @ownership_id int,
    @start_date datetime,
    @end_date datetime
)
as
begin
    
    select * 
    into #incidents_to_be_reschudeled
    from vwLightIncident 
    where id in (select id 
                    from incident 
                    where ownership_id = @ownership_id
                        and date < @start_date)

    select * 
    into #incidents_to_be_incorporated
    from vwLightIncident 
    where id in (select id 
                    from incident 
                    where ownership_id != @ownership_id
                        and date between @start_date and @end_date)

    select * 
    into #actions_to_be_rescheduled
    from vwIncidentAction 
    where id in (select ia.id 
                    from incident_action ia
                        join incident_action_incident iai on iai.incident_id = ia.id
                    where iai.incident_id = @ownership_id
                        and treated_until < @start_date)

end