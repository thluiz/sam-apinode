CREATE view vwProduct    
as    
select p.*, c.[name] currency, c.symbol currency_symbol 
from product p  (nolock)
 join currency c (nolock) on c.id = p.currency_id