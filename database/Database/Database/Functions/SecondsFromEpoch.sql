 CREATE function SecondsFromEpoch(@date datetime) 
 returns bigint    
 with schemabinding     
 as    
 begin     
 return CONVERT(bigint, DATEDIFF(second, '19700101', @date))    
 end