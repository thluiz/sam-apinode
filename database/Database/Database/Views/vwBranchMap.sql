 CREATE view vwBranchMap  
 as  
  select bm.id, bm.branch_id,     
  bm.incident_type incident_type_id, eit.name incident_type,           
  bm.receive_voucher, bm.title, bm.start_hour, bm.start_minute,        
  bm.end_hour, bm.end_minute, bm.base_description,         
  isnull((            
  select bms.*, wdn.abrev, wdn.name    
  from branch_map_schedule bms            
   join week_day_name wdn on bms.week_day = wdn.number    
  where bms.branch_map_id = bm.id            
  for json path            
  ), '[]') week_days, bm.active            
  from branch_map bm            
  join enum_incident_type eit on eit.id = bm.incident_type