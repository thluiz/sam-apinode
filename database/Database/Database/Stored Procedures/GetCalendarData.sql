
CREATE procedure GetCalendarData
as
begin
    declare @start_date date = '2018-10-01', 
            @end_date date = '2018-10-31'

    select * 
    into #ownerships
    from vwLightIncident 
    where id in (
            select id
            from incident (nolock)
            where treated = 0 and cancelled = 0
                and incident_type = 36
                and branch_id = 1
                and cast(date as date) between @start_date and @end_date
    )

    select *     
    into #incidents
    from vwLightIncident 
    where id in (
                select id
                from incident (nolock)
                where treated = 0 and cancelled = 0
                    and incident_type != 36
                    and branch_id = 1
                    and cast(date as date) between @start_date and @end_date
    )

    select 
        (select count(1) items, cast(date as date) date 
        from  #incidents
        where ownership_id is null
        group by casT(date as date)
        for json path) incidents_without_ownership,
        (select *, (select count(distinct person_id) 
                    from #incidents 
                    where ownership_id = o.id) people,
                    (select count(1) items, abrev  
                    from #incidents 
                    where ownership_id = o.id
                    group by abrev                    
                    for json path) incidents_count
        from #ownerships o
        for json path) ownerships
    for json path


    drop table #incidents
    drop table #ownerships

end