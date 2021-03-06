﻿CREATE view vwCardCommentary     
as    
select cc.*,      
	responsible.[name] responsible, responsible.avatar_img,  
	CONVERT (VARCHAR, cc.created_on, 103) created_date_br,  
	convert(char(5), cc.created_on, 108) created_hour_br	     
from card_commentary cc    
join [user] u on cc.responsible_id = u.id    
join vwPerson responsible on responsible.id = u.person_id