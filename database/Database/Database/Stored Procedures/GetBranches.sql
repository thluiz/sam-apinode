CREATE procedure GetBranches(  
 @active bit = 1  
)  
as  
begin  
  
 select b.*, ebc.description category, ebc.abrev category_abrev   
 from branch b  
	join enum_branch_category ebc on ebc.id = b.category_id 
 where b.active = ISNULL(@active, b.active)   
 order by [order], b.name
 for json path  
  
end