
CREATE procedure GetDataForChangeOwnership(@ownership_id int)  
as  
begin  
  
    select ROW_NUMBER() over (order by sr.date, sr.id) num, *   
    into #surrogates  
    from vwLightIncident sr  
    where id in (  
        select top 2 i.id  
        from incident i          
        where ownership_id = @ownership_id  
            and incident_type = 39  
            and cancelled = 0
            and treated = 0
            and closed = 0
        order by date, id  
    )  
  
    select   
        (  
            select top 1 *   
            from #surrogates  
            where num = 1  
            for json path  
        ) first_surrogate,  
        (  
            select top 1 *   
            from #surrogates   
            where num = 2  
            for json path  
        ) second_surrogate  
    for json path  
  
  
end