CREATE procedure [dbo].[GetPersonData](@id int)                      
as                      
begin                      
 select *
 from vwPerson p
 where p.id = @id                      
 for json path                      
end     