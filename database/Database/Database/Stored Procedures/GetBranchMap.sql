CREATE procedure GetBranchMap(@branch_id int)        
as        
begin        
        
 if(not exists(select 1 from branch_map where active = 1 and branch_id = @branch_id))        
 begin        
  select CAST(1 as bit) empty for json path        
  return        
 end        
        
 select bm.id, bm.branch_id, 
 bm.incident_type incident_type_id, eit.name incident_type,       
 bm.receive_voucher, bm.title, bm.start_hour, bm.start_minute,    
 bm.end_hour, bm.end_minute,      
 isnull((        
  select bms.*, wdn.abrev, wdn.name
  from branch_map_schedule bms        
	join week_day_name wdn on bms.week_day = wdn.number
  where bms.branch_map_id = bm.id        
  for json path        
 ), '[]') week_days         
 from branch_map bm        
	join enum_incident_type eit on eit.id = bm.incident_type
 where branch_id = @branch_id        
	and bm.active = 1      
 for json path        
        
end