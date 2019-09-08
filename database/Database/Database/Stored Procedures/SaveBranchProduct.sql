CREATE procedure SaveBranchProduct(	
	@branch_id int,
	@category_id int,
	@currency_id int,
	@base_value decimal(12,2),
	@name varchar(250),
	@id int = 0
)
as
begin

	if(@id > 0)
		update branch_product set
            name = @name,                        
            base_value = @base_value,
            currency_id = @currency_id,
            category_id = @category_id
        where id = @id
	else
		insert into branch_product(name, branch_id, base_value, currency_id, category_id)
            values (@name, @branch_id, @base_value, @currency_id, @category_id)


end