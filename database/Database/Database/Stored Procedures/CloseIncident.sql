CREATE procedure [dbo].[CloseIncident](  
    @incident int, @close_description varchar(max) = null,   
    @responsible_id int = null,   
    @title varchar(400) = '',   
    @payment_method_id int = null,  
    @fund_value decimal(12,2) = 0)                    
as                    
begin                 
  
 declare @person int, @type int, @card_id int, @define_fund_value bit    
                
 select @card_id = card_id from incident where id = @incident              
              
 select @person = pic.person_id,   
            @type = i.incident_type,   
            @define_fund_value = define_fund_value                    
 from incident i                    
  join  person_incident pic on pic.incident_id = i.id                    
 where i.id = @incident              
              
  if(@card_id is not null)              
  begin              
  declare @close_step int              
  select top 1 @close_step = cs.id              
  from [card] c              
   join [card] parent on parent.id = c.parent_id              
   join [card_step] cs on cs.card_id = parent.id              
  where c.id = @card_id              
   and cs.is_closing_step = 1              
              
  exec SaveCardStep @card_id, @close_step, @responsible_id, @load_card = 0              
  end              
              
 update i set i.closed = 1,                   
  i.[close_text] = isnull(@close_description, ''),              
  i.closed_on = getUTCdate(),      
  i.closed_by = @responsible_id,    
  i.title = case when len(@title) > 0 then @title else i.title end,  
  i.payment_method_id = isnull(@payment_method_id, i.payment_method_id),  
  i.fund_value = @fund_value  
 from incident i                  
 where id = @incident                                
                     
 if(@type = 10)      
 exec SaveP1SessionsPerMonth @person      
  
 if(@type = 36 and @define_fund_value = 1)  
    update i set i.fund_value = @fund_value  
    from incident i   
        where i.incident_type = 41  
            and i.ownership_id = @incident  
                   
 exec CheckPeopleStatus @person                    
           
 select * from vwLightIncident          
 where id = @incident          
 for json path          
          
end  
  