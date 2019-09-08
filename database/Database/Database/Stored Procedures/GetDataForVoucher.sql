    
CREATE procedure GetDataForVoucher            
as            
begin             
            
 select            
  (select *,          
 (          
  select *           
  from vwBranchMap bm          
  where bm.active = 1       
 and bm.receive_voucher = 1     
 and bm.branch_id = b.id         
  for json path            
 ) voucher_map           
  from branch b            
  where active = 1            
		and category_id in (1, 3)
   for json path) branches,        
   (select * from voucher where active = 1 for json path) vouchers,          
   (select * from branch_voucher for json path) branch_vouchers  
 for json path            
            
end