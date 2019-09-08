  
  
CREATE function GetAbreviation(@string varchar(max))  
returns varchar(max)  
as  
begin  
  
 declare @abrev varchar(max) = (SELECT (SELECT LEFT(Item,1)  
          FROM dbo.Split(@string, ' ')           
        FOR XML PATH(''),TYPE).value('.','varchar(max)'))  
  
 return @abrev  
  
end  
  
