-- drop view vwLightIncident                                      
CREATE view vwLightIncident                                      
with schemabinding                                      
as                                      
select i.id, i.branch_id, i.cancelled, i.card_id, i.closed, i.comment_count,                                     
 i.started_on, i.closed_on, i.end_date, i.date, i.treated, i.incident_type, i.title,                                       
 cast(case when i.date < dateadd(hour, isnull(tz.gmt_variation, tzBranch.gmt_variation), dbo.getCurrentDateTime())  then 1 else  0 end as bit) past,                                      
 isnull(parent_type.abrev, '') + eit.abrev abrev, eit.show_hour_in_diary,                                    
 eit.need_start_hour_minute, eit.need_to_be_started, eit.activity_type, eit.financial_type,                                    
 eit.need_description,  eit.need_description_for_closing, eit.need_value, eit.obrigatory,                            
 eit.need_fund_value,                             
 b.initials branch_initials,                                          
 p.id person_id, p.name person, isnull(p.alias, p.name) person_name,                                     
 p.comunication_status, p.data_status, p.financial_status, p.scheduling_status,                                      
 p.comunication_description, p.data_status_description, p.financial_description, p.scheduling_description,                          
 p.offering_status_description, p.offering_status,                             
 p.pinned_comment_count,                             
 i.payment_method_id, pm.[name] payment_method, eit.require_title,                             
 eit.require_ownership, i.define_fund_value, i.fund_value,                      
 dbo.SecondsFromEpoch(i.date) date_in_seconds,                       
 dbo.SecondsFromEpoch(i.started_on) started_date_in_seconds,                    
 l.name location_name, l.id location_id,     
 i.description,        
 isnull(l.timezone_id, lBranch.timezone_id) timezone_id,           
 isnull(tz.gmt_variation, tzBranch.gmt_variation) gmt,          
 isnull(i.ownership_id, -1) ownership_id,         
 isnull(parent_type.name + ' ', '') + eit.name incident_type_name,
 actions_count,                  
    (select ic.archived, ic.id, ic.comment, ic.created_at,               
        ic.incident_id, ic.responsible_id, isnull(p.alias, p.name) person_name                 
        from dbo.incident_comment ic                
            join dbo.person p on p.id = ic.responsible_id                 
        where ic.incident_id = i.id                
            and ic.archived = 0                
        order by ic.created_at desc                        
        for json path) comments              
from dbo.incident i (nolock)                                                    
 join dbo.enum_incident_type eit (nolock) on eit.id = i.incident_type                                         
 join dbo.person_incident pic (nolock) on pic.incident_id = i.id                                      
 join dbo.person p (nolock) on p.id = pic.person_id                                      
 left join dbo.branch b (nolock) on b.id = i.branch_id                                      
 left join dbo.enum_incident_type parent_type (nolock) on parent_type.id = eit.parent_id                                 
 left join dbo.payment_method pm (nolock) on pm.id = i.payment_method_id            
 left join dbo.[location] l (nolock) on l.id = i.location_id          
 left join dbo.timezone tz (nolock) on l.timezone_id = tz.id          
 left join dbo.[location] lBranch (nolock) on lBranch.id = b.location_id          
 left join dbo.timezone tzBranch (nolock) on tzBranch.id = lBranch.timezone_id