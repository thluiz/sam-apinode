CREATE procedure [dbo].[SaveCard](        
 @title nvarchar(500),        
 @parent_id int,         
 @due_date datetime,        
 @description nvarchar(max),        
 @card_template_id int,        
 @location_id int,        
 @abrev nvarchar(15)  = null,        
 @leader_id int  = null,      
 @people varchar(max),      
 @group_id int  = null,      
 @branch_id int,      
 @new_people varchar(max) = null,       
 @responsible_id int = null,
 @person_partnership_id int = null,
 @person_external_unit_id int  = null
)        
as        
begin         
 declare @require_target bit,       
 @require_target_group bit,       
 @is_task bit, @card_id int      
      
 select @require_target = require_target,       
  @require_target_group = require_target_group,      
  @is_task = is_task      
 from card_template where id = @card_template_id      
       
 if(@is_task = 1)      
 begin       
      
  if(@require_target = 0)       
  begin      
   insert into [card]        
   (title, parent_id, due_date, feature_area_id, [description], [leader_id], card_template_id, location_id, abrev, created_by)        
   values        
   (@title, @parent_id, @due_date, 1, @description, @leader_id, @card_template_id, @location_id, @abrev, @responsible_id)         
      
   set @card_id = @@IDENTITY        
      
   exec SaveCardHistory @card_id, 5, @responsible_id      
   exec GenerateIncidentsForCard @card_id    
  end      
  else      
  begin      
   declare @pp table(item int not null)  
  
   if(LEN(@people) > 0)  
    insert into @pp(item)  
     select item         
     from dbo.split(@people, ',')      
      
   if(len(isnull(@new_people, '')) > 0)                  
   begin                              
    select distinct ltrim(rtrim(item)) [name]                  
    into #new_people                  
    from dbo.Split(@new_people, ',')                  
                  
    while(exists(select 1 from #new_people))                  
    begin                  
     declare @name varchar(200) = (select top 1 [name] from #new_people)                  
                  
     insert into person([name], is_interested) values (@name, 1)                         
                      
     declare @new_person int = @@identity                  
     insert into person_role(person_id, role_id) values (@new_person, 4)        
        
     insert into @pp(item) values (@new_person)             
                  
     delete from #new_people where [name] = @name                          
    end        
      
    drop table #new_people      
   end      
      
   while exists(select 1 from @pp)      
   begin      
    declare @person int = (select top 1 item from @pp)      
      
    insert into [card]        
    (title, parent_id, due_date, feature_area_id, [description], [leader_id], card_template_id, location_id, abrev, created_by)        
    values        
    (@title, @parent_id, @due_date, 1, @description, @leader_id, @card_template_id, @location_id, @abrev, @responsible_id)         
      
    set @card_id = @@IDENTITY       
      
    exec SaveCardHistory @card_id, 5, @responsible_id      
    exec GenerateIncidentsForCard @card_id    
    
    insert into person_card(person_id, card_id, position)       
    values (@person, @card_id, 5)        
          
    delete from @pp where item = @person                   
   end            
  end          
 end       
 else       
 begin            
  insert into [card]        
  (title, parent_id, due_date, feature_area_id, [description], [leader_id], card_template_id, location_id, abrev, created_by)        
  values        
  (@title, @parent_id, @due_date, 1, @description, @leader_id, @card_template_id, @location_id, @abrev, @responsible_id)       
       
  set @card_id = @@IDENTITY       
       
  exec SaveCardHistory @card_id, 5, @responsible_id          
      
  insert into [card_step]([name], card_id, is_blocking_step, is_closing_step, need_action)        
  values (      
  case when @card_template_id != 2 then       
  'Fazer'      
  else       
  'A Convidar'      
  end       
  , @card_id, 0, 0, 0)      
       
  declare @card_step_id int = @@IDENTITY      
      
  if(@require_target_group = 1)      
  begin      
   exec GenerateCardsForGroup @card_id, @card_step_id, @group_id, @branch_id      
  end      
      
  exec GenerateAditionalStepsForCard @card_id          
 end         
         
 if(@person_partnership_id is not null and @person_partnership_id > 0)
	update person_partnership set card_id = @card_id where id = @person_partnership_id

 if(@person_external_unit_id is not null and @person_external_unit_id > 0)
	update person_external_unit set card_id = @card_id where id = @person_external_unit_id

 select * from vwCard        
 where id = @card_id        
 for json path        
        
end