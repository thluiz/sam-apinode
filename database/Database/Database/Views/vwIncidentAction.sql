CREATE view vwIncidentAction     
with schemabinding          
as          
    select ia.id, ia.incident_action_configuration_id, ia.location_id,           
        ia.incident_action_type, iat.name incident_action_type_name,          
        ia.title, ia.[description], ia.original_incident_action_id,           
        ia.created_at, ia.created_by, isnull(r.alias, r.name) created_by_name,          
        ia.completed, ia.completed_by, ia.completed_at, isnull(cp.alias, cp.name) completed_by_name,          
        ia.treated, ia.treated_by, ia.treated_at, isnull(tr.alias, tr.name) treated_by_name,          
        ia.cancelled, ia.treated_until,        
        (select iai.incident_id id, iai.treated, iai.treated_at, isnull(piai.alias, piai.name) treated_by_name          
        from dbo.incident_action_incident iai (nolock)         
            left join dbo.person piai (nolock) on piai.id = iai.treated_by        
        where iai.incident_action_id = ia.id        
        for json path) incidents,      
        (select iac.id, iac.archived, iac.comment, iac.comment_type, iac.created_at, iac.created_by,     
                iac.incident_action_id, isnull(piac.alias, piac.name) created_by_name      
        from dbo.incident_action_comment iac (nolock)         
            left join dbo.person piac (nolock) on piac.id = iac.created_by      
        where iac.incident_action_id = ia.id        
            and iac.archived = 0    
        order by iac.created_at desc    
        for json path) comments       
    from dbo.incident_action ia (nolock)          
        join dbo.incident_action_type iat (nolock) on iat.id = ia.incident_action_type          
        left join dbo.person r (nolock) on r.id = ia.created_by          
        left join dbo.person cp (nolock) on cp.id = ia.completed_by          
        left join dbo.person tr (nolock) on tr.id = ia.treated_by