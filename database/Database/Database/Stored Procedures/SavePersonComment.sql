CREATE procedure [dbo].[SavePersonComment](  
 @person_id int,  
 @comment nvarchar(max),  
 @responsible_id int  = null  
)  
as  
begin  
  
 insert into person_comment(person_id, comment, responsible_id, created_at)   
 values (@person_id, @comment, @responsible_id, dbo.getCurrentDateTime())  
  
end  
  
--GetCommentsAboutPerson 2  
