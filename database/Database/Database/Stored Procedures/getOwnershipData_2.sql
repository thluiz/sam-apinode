CREATE procedure getOwnershipData(@ownership_id int)  
as  
begin   
    
 select top 1 *,   
 (select *, 
    (select * 
        from incident_comment ic where ic.incident_id = v.id
        for json path 
    ) comments
 from vwIncident v where id in (  
 select i.id  
 from incident tit  
  join incident i on i.branch_id = tit.branch_id        
       and i.id != tit.id  
       and i.cancelled = 0  
       and i.ownership_id = tit.id  
 where tit.id = @ownership_id)  
 order by v.full_date  
 for json path) incidents,
 (select ic.*, isnull(p.alias, p.name) responsible  
    from incident_comment ic 
        left join person p on p.id = ic.responsible_id
    where ic.incident_id = @ownership_id
        and ic.archived = 0
    order by ic.created_at desc
    for json path
 ) comments,
 (select ia.title, ia.completed, ia.completed_at, ia.completed_by_name, ia.comments, 
    ia.created_at, ia.created_by_name, ia.[description], ia.incident_action_type,
    ia.treated_until, iai.treated, isnull(treated_by.alias, treated_by.name) treated_by_name  
 from vwIncidentAction ia 
    join incident_action_incident iai on iai.incident_id = @ownership_id and iai.incident_action_id = ia.id
    left join person treated_by on treated_by.id = iai.treated_by
 where ia.id in (select id from incident_action_incident ia2 where ia2.incident_id = @ownership_id)
 order by ia.created_at
 for json path) actions  
 from vwIncident where id = @ownership_id  
 for json path  
  
end