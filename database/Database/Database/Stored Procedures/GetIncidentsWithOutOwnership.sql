CREATE procedure GetIncidentsWithOutOwnership(
    @branch_id int, @location_id int, @start_date datetime, @end_date datetime
)
as
begin

    select * 
    from vwLightIncident i
    where i.id in (
        select id 
        from incident i2
        where i2.cancelled = 0             
            and i2.date between @start_date and @end_date
            and i2.incident_type != 36
            and i2.ownership_id is null
            and (i2.branch_id is null or i2.branch_id = isnull(@branch_id, i2.branch_id))
            and (i2.location_id is null or i2.location_id = isnull(@location_id, i2.location_id))
    )
    for json path
    

end