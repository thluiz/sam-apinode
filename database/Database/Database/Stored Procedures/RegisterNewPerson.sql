CREATE procedure [dbo].[RegisterNewPerson](    
 @role_id int,     
 @name varchar(200),              
 @branch_id int,         
 @birth_date date,                                
 @identification varchar(50),      
 @identification2 varchar(50),       
 @occupation varchar(100),              
 @next_incident_type int,    
 @next_incident_date datetime,    
 @next_incident_description nvarchar(max),    
 @initial_contact varchar(max),    
 @comment varchar(max),    
 @responsible_id int = null,
 @user_id int = null -- Retirar do sistema               
)    
as    
begin     
 declare @current_date datetime = dbo.getCurrentDateTime()    
    
 insert into person([name], birth_date, identification, identification2, occupation, branch_id)     
 values (@name, @birth_date, @identification, @identification2, @occupation, @branch_id)                       
                    
 declare @new_person int = @@identity                
       
    -- initial contact    
 exec RegisterNewIncident 5, @new_person, @current_date, @branch_id, null, @initial_contact, null, 1, @responsible_id    
    
 exec AddPersonRole @new_person, @role_id       
       
 if(@comment is not null and len(@comment) > 0)  
 exec SavePersonComment @new_person, @comment, @responsible_id    
    
 exec CheckPeopleStatus @new_person    
    
 -- next incident   
 if(@next_incident_type is not null and @next_incident_type > 0)   
 exec RegisterNewIncident @next_incident_type, @new_person, @next_incident_date, @branch_id, null, @next_incident_description, null, 0, @responsible_id    
     
 select * from vwPerson where id = @new_person  
 for json path  
  
end  
  
  
  
  
  
  
  
  