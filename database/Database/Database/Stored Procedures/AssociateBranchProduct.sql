CREATE procedure AssociateBranchProduct(
	@branch_id int,
	@product_id int,
	@base_value decimal(12,2)
)
as
begin

	insert into branch_product(branch_id, product_id, category_id, base_value)
	select @branch_id, @product_id, p.category_id, @base_value
	from product p where id = @product_id


end