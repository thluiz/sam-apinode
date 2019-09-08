CREATE view vwBranch  
as  
select *,  
 isnull((select a.* from acquirer a   
 join branch_acquirer ba on ba.acquirer_id = a.id  
 where ba.branch_id = b.id  
 for json path), '[]') acquirers   
from branch b