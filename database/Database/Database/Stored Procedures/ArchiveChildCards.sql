create procedure ArchiveChildCards
as
begin

    update c set c.parent_archived = 1
    from [card] c
    where 
        parent_archived = 0
        and (
        --card with archived parents
        exists(select 1 
            from [card] parent         
                where parent.id = c.parent_id    
                and (closed = 1    
                 or cancelled = 1    
                 or archived = 1)    
        )    
        or exists (    
            select 1 from [card] parent    
            join [card] grand_parent on grand_parent.id = parent.parent_id         
            where parent.id = c.parent_id    
            and (grand_parent.closed = 1    
             or grand_parent.cancelled = 1    
             or grand_parent.archived = 1)    
        ))    

end