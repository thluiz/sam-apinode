
CREATE procedure GetPersonScheduling(@person_id int)      
 as      
 begin            
    
 select ps.*,           
  case when len(eit.[name]) > 10 then eit.abrev else eit.[name] end type_description,            
  rt.[description] recurrence_description,                   
  case when ps.week_day = 1 then 'Dom'                  
  when ps.week_day = 2 then 'Seg'                   
  when ps.week_day = 3 then 'Ter'                   
  when ps.week_day = 4 then 'Qua'                   
  when ps.week_day = 5 then 'Qui'                   
  when ps.week_day = 6 then 'Sex'                   
  when ps.week_day = 7 then 'Sab'                   
  end week_day_description                      
 from person_schedule ps                             
  join enum_incident_type eit on eit.id = ps.incident_type                             
  join recurrence_type rt on rt.id = ps.recurrence_type                  
 where ps.person_id = @person_id              
  and ps.cancelled = 0        
 for json path       
      
      
 end 