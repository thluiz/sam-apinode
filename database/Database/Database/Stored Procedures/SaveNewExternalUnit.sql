CREATE procedure [dbo].[SaveNewExternalUnit](  
 @person_id int,   
 @comments nvarchar(max),  
 @name nvarchar(250),  
 @branch_id int,  
 @operator_id int,  
 @indication_contact_type int  
)  
as  
begin  
  
 declare @branch int, 
 @current_date datetime = dbo.getcurrentDateTime(),
 @next_date datetime = dateadd(DAY, 1, dbo.getcurrentDateTime()),
 @monitoring_project int, @branch_location_id int,                
 @responsible_id int, @person2_id int, @indicator_name varchar(250),  
 @person_external_unit_id int      
  
 select @branch = branch_id, @indicator_name = [name]         
 from person where id = @person_id     
  
 if(@branch_id is not null)      
  set @branch = @branch_id      
  
 insert into person_external_unit(person_id, name, commentary)        
 values (@person_id, @name, @comments)       
  
 set @person_external_unit_id = @@IDENTITY  
   
 select @monitoring_project = c.id,                 
 @branch_location_id = b.location_id,                
 @responsible_id = c.leader_id                
 from card c                 
 join branch b on c.location_id = b.location_id                
 where c.card_template_id = 13 and b.id = isnull(@branch_id, @branch)        
  
  declare @desc nvarchar(max) = 'Indicado por ' + @indicator_name + CHAR(13)+CHAR(10)+CHAR(13)+CHAR(10) + @comments       
        
  exec SaveCard @title = @name, @description = @desc,                
   @parent_id = @monitoring_project,                 
   @due_date = @next_date, @card_template_id = 3,                
   @location_id = @branch_location_id,                   
   @people = null, @branch_id = @branch,                
   @responsible_id = @responsible_id, @leader_id = @operator_id,  
   @person_external_unit_id = @person_external_unit_id    
     
  
 declare @card_id int = (select card_id from person_external_unit pr where pr.id = @person_external_unit_id)                  
              
 if(@indication_contact_type = 1)      
 begin      
  insert into person_card(person_id,  card_id, position, [order])      
  values (@person_id, @card_id, 6, 0)       
 end       
   
  update [card] set current_step_id = (select top 1 cs.id               
  from card_step cs              
  join [card] c on card.parent_id = cs.card_id              
  where c.id = @card_id)              
 where id = @card_id      
  
end