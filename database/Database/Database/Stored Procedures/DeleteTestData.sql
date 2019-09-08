CREATE procedure [dbo].[DeleteTestData]                
as                
begin                 
 declare @name varchar(150) = 'teste'                
                
 delete pic                 
 from person_incident pic                 
  join person p on pic.person_id = p.id                
 where [name] like '%' + @name + '%'                
                
 delete pr                
 from person_role pr                
  join person p on pr.person_id = p.id                
 where [name] like '%' + @name + '%'                
              
 delete pc                
 from person_comment pc                
  join person p on pc.person_id = p.id                
 where [name] like '%' + @name + '%'                
                
 delete pc                
 from person_card pc                
  join person p on pc.person_id = p.id                
 where [name] like '%' + @name + '%'              
       
 update c set c.archived = 1      
 from [card] c      
  join person_card pc  on pc.card_id = c.id              
  join person p on pc.person_id = p.id                  
 where [name] like '%' + @name + '%'              
                
 delete pc                
 from person_contact pc                
  join person p on pc.person_id = p.id                
 where [name] like '%' + @name + '%'              
              
 delete i       
 from incident i      
 join person p on p.id = i.responsible_id      
 where p.[name] like '%' + @name + '%'        
    
  delete pv       
 from person_voucher pv    
 join person p on p.id = pv.person_id    
 where p.[name] like '%' + @name + '%'      
                     
 delete from card_commentary where commentary like 'teste%' and responsible_id = 16                
      
 delete ch           
 from card_history ch           
  join [card] c on c.id = ch.card_id          
 where c.title like '%' + @name + '%'                  
          
 delete cs           
 from card_step cs           
  join [card] c on c.id = cs.card_id          
 where c.title like '%' + @name + '%'         
          
 delete pc           
 from person_card pc          
  join [card] c on c.id = pc.card_id          
 where c.title like '%' + @name + '%'                 
           
 delete from person_incident where incident_id in (        
  select i.id        
  from [card] c          
   join incident i on i.card_id = c.id        
   where c.title like '%' + @name + '%'              
 )    

 delete from incident_treatment where incident_id in (        
  select i.id        
  from [card] c          
   join incident i on i.card_id = c.id        
   where c.title like '%' + @name + '%'              
 )       
                    
 delete from incident where card_id in (        
  select id from [card] c          
   where c.title like '%' + @name + '%'              
 )        
        
 delete c          
  from [card] c          
 where c.title like '%' + @name + '%'           
     
delete from person_relationship where person2_id in (  
 select id from person where name like '%' + @name + '%'  
)  
  
delete from person_relationship where person_id in (  
 select id from person where name like '%' + @name + '%'  
)  
  
delete from card where id in (  
 select card_id from person_partnership where name like '%' + @name + '%'    
)  
  
delete from person_partnership where name like '%' + @name + '%'   
  
  
delete from card where id in (  
 select card_id from person_external_unit where name like '%' + @name + '%'    
)  
  
delete from person_external_unit where name like '%' + @name + '%'   
  
delete from person where [name] like '%' + @name + '%'         
          
end  
  