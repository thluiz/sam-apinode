CREATE function getCurrentDateTime()    
returns datetime    
with schemabinding
as    
begin    
    
 return getUtcDate()   
    
end