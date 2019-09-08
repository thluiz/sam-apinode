
CREATE procedure UpdatePeopleIncidents(@person_id int = null)
as
begin    
    select p.id person_id, (select top 1 i2.id
                                from incident i2  (nolock)
                                    join person_incident pic2  (nolock) on pic2.incident_id = i2.id
                                where i2.date > getUTCdate()
                                    and i2.cancelled = 0      
                                    and pic2.person_id = p.id
                                order by i2.date) incident_id
    into #next_incidents        
    from person p  (nolock)
    where p.id = isnull(@person_id, p.id)
    order by p.id
    
    select p.id person_id, (select top 1 i2.id
                                from incident i2 (nolock)
                                    join person_incident pic2  (nolock) on pic2.incident_id = i2.id
                                where i2.date < getUTCdate()
                                    and i2.cancelled = 0      
                                    and pic2.person_id = p.id
                                order by i2.date desc) incident_id
    into #last_incidents        
    from person p  (nolock)
    where p.id = isnull(@person_id, p.id)
    order by p.id

    update p set p.last_incident_id = last_incident.incident_id    
    from person p        
        join #last_incidents last_incident on last_incident.person_id = p.id                                                    
    where p.id = isnull(@person_id, p.id)
        and (last_incident.incident_id != p.last_incident_id
            or (last_incident.incident_id is null and p.last_incident_id is not null)
            or (last_incident.incident_id is not null and p.last_incident_id is null)
        )
        
    update p set p.next_incident_id = next_incident.incident_id                    
    from person p
        join #next_incidents next_incident on next_incident.person_id = p.id                        
    where p.id = isnull(@person_id, p.id)
        and (next_incident.incident_id != p.next_incident_id
            or (next_incident.incident_id is null and p.next_incident_id is not null)
            or (next_incident.incident_id is not null and p.next_incident_id is null)
        )
            

    drop table #next_incidents
    drop table #last_incidents

end