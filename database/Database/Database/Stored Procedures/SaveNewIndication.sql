      
CREATE procedure [dbo].[SaveNewIndication](              
 @person_id int, @name varchar(250),               
 @contact_type1 int, @contact1 varchar(250),              
 @contact_type2 int, @contact2 varchar(250),              
 @contact_type3 int, @contact3 varchar(250),              
 @comments nvarchar(max),            
 @age int = null,        
 @district varchar(100),         
 @occupation varchar(100),        
 @branch_id int = null,            
 @indication_contact_type int = 0,            
 @operator_id int = null        
)              
as              
begin                
        
 declare @branch int, @current_date datetime = dbo.getcurrentDateTime(),              
 @monitoring_project int, @branch_location_id int,                      
 @responsible_id int, @person2_id int, @indicator_name varchar(250)              
              
 select @branch = branch_id, @indicator_name = [name]               
 from vwPerson where id = @person_id            
        
 declare @desc nvarchar(max) = 'Convidado por ' + @indicator_name              
 declare @title varchar(500)        
         
 if(@indication_contact_type = 0)        
   set @title = 'Convite Indireto - ' + @indicator_name        
 else if(@indication_contact_type = 1)                
   set @title = 'Convite Direto - ' + @indicator_name        
 else                
   set @title = 'Convite Anônimo - ' + @indicator_name               
        
             
 if(@branch_id is not null)            
 set @branch = @branch_id            
              
 insert into person([name], branch_id, scheduling_status, is_interested, age, occupation)              
 values (@name, @branch, 1, 1, isnull(@age, 0), @occupation)              
               
 set @person2_id = @@IDENTITY              
               
  insert into person_relationship(person_id, person2_id, relationship_type)              
  values (@person_id, @person2_id, 
		case when @indication_contact_type = 0 then 13
			when @indication_contact_type = 1 then 10
			else 14
		end)                         
           
  select @monitoring_project = c.id,                       
  @branch_location_id = b.location_id,                      
  @responsible_id = c.leader_id                      
  from card c                       
   join branch b on c.location_id = b.location_id                      
  where c.card_template_id = 11 and b.id = isnull(@branch_id, @branch)              
            
  if(len(@contact1) > 0)                        
   insert into person_contact(person_id, contact_type, contact, principal)                        
   values (@person2_id, @contact_type1, @contact1, 1)              
              
 if(len(@contact2) > 0)                        
   insert into person_contact(person_id, contact_type, contact)                        
   values (@person2_id, @contact_type2, @contact2)              
              
 if(len(@contact3) > 0)                        
   insert into person_contact(person_id, contact_type, contact)                        
   values (@person2_id, @contact_type3, @contact3)              
             
 if(@age > 0)              
  insert into person_comment(person_id, comment)                      
  values (@person2_id, 'Idade aproximada: ' + cast(@age as varchar))              
           
 if(LEN(@comments) > 0)              
  insert into person_comment(person_id, comment)                      
  values (@person2_id, @comments)              
          
 if(len(@district) > 0)                          
 begin        
    -- TODO: Pegar do núcleo os dados do endereço        
 declare @city varchar(150) = '', @state varchar(100) = '', @country_id int = 1        
         
 insert into address(district, country_id, city, [state], postal_code, street) values (@district, @country_id, @city, @state,  '', '')        
 declare @address_id int = @@identity        
        
 insert into person_address(person_id, address_id) values (@person2_id, @address_id)        
 end        
         
              
 insert into person_role(person_id, role_id)                      
  values (@person2_id, 4)             
                       
 exec SaveCard @title = @title, @description = @desc,                      
  @parent_id = @monitoring_project,                       
  @due_date = @current_date, @card_template_id = 1,                      
  @location_id = @branch_location_id,                         
  @people = @person2_id, @branch_id = @branch,                      
  @responsible_id = @responsible_id, @leader_id = @operator_id                          
                      
 declare @card_id int = (select card_id from person_card pc where pc.person_id = @person2_id and position = 5)          
                    
 if(@indication_contact_type = 1)            
 begin            
 insert into person_card(person_id,  card_id, position, [order])            
 values (@person_id, @card_id, 6, 0)             
 end            
          
 update person_relationship set monitoring_card_id = @card_id where person2_id = @person2_id     
      
 update [card] set current_step_id = (select top 1 cs.id                     
          from card_step cs                    
           join [card] c on card.parent_id = cs.card_id                    
          where c.id = @card_id    
    order by cs.[order])                    
 where id = @card_id                  
              
 exec CheckPeopleStatus @person_id              
              
end