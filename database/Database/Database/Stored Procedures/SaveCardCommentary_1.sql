CREATE procedure SaveCardCommentary(    
@card_id int,     
@commentary nvarchar(max),    
@responsible_id int,  
@commentary_type int,
@load_comments bit = 1    
)    
as    
begin    
  declare @branch int, @target int,   
   @current_date datetime = dbo.getCurrentDateTime()  
  
 insert into card_commentary(card_id, commentary, created_on, responsible_id)     
 values (@card_id, @commentary, dbo.getCurrentDateTime(), @responsible_id)    
    
     
 if(@commentary_type = 1)  
 begin   
 select @branch = branch_id from person where id = @responsible_id  
  
 exec RegisterNewIncident  @type = 29, @people = @responsible_id, @branch = @branch,   
      @date = @current_date, @description = @commentary,   
      @register_closed = 1, @responsible_id = @responsible_id,  
      @card_id = @card_id  
 end  
 else if(@commentary_type in (2, 3))  
 begin   
 declare @register_treated bit = 0  
 select top 1 @target = person_id from person_card pc where pc.card_id = @card_id and pc.position = 5  
   
 if(@target is null)  
 return  
   
 select @branch = branch_id from person where id = @target  
  
 if(@commentary_type = 3)  
  set @register_treated = 1  
  
 exec RegisterNewIncident  @type = 5, @people = @target, @branch = @branch,   
      @date = @current_date, @description = @commentary, @register_closed = 1,   
      @responsible_id = @responsible_id, @register_treated = @register_treated,  
      @card_id = @card_id  
 end  
  
 if(@load_comments = 1)
	select * from vwCardCommentary where card_id = @card_id    
	for json path   
    
end