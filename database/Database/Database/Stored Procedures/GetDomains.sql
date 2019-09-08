create procedure GetDomains
as
begin

	select do.*        
    from domain do             
    order by [order] desc        
    for json path

end