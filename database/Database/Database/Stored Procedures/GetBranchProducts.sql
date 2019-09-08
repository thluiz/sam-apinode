CREATE procedure GetBranchProducts(@branch_id int)    
as    
begin    
    
 if(not exists(select 1 from branch_product    
 where archived = 0 and branch_id = @branch_id))    
 begin    
  select CAST(1 as bit) empty    
  for json path    
  return    
 end    
    
    
 select bp.id, bp.category_id, pc.name category, bp.product_id, ISNULL(bp.name, p.name) product, c.symbol currency_symbol, bp.base_value, c.id currency_id    
 from branch_product bp    
  join product_category pc on pc.id = bp.category_id    
  join currency c on c.id= bp.currency_id  
  left join product p on p.id = bp.product_id    
 where branch_id = @branch_id 
	and bp.archived = 0    
 for json path    
    
end