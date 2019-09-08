CREATE procedure MigrateOwnership(@ownership_id int,     
    @location_id int,     
    @end_date datetime,     
    @incidents_list varchar(max),    
    @date datetime = null,    
    @description nvarchar(max) = null    
)        
as        
begin        
        
    declare @branch_id int, @ownership_date datetime, @location_branch int       
          
    declare @incidents table(id int)      
      
    insert into @incidents      
        select cast(item as int) from dbo.Split(@incidents_list, ',')      
        
    select @branch_id = branch_id, @ownership_date = i.date        
    from incident i        
    where id = @ownership_id             
        
    select @location_branch = branch_id from location where id = @location_id

    if(@branch_id is null)        
        set @branch_id = -1;        
            
    update incident set     
        end_date = @end_date,     
        location_id = @location_id,    
        [date] = isnull(@date, [date]),    
        branch_id = @location_branch,
        [description] = case when @description is not null and len(@description) > 0 then     
                            @description     
                        else     
                            [description]     
                        end    
    where id = @ownership_id        
        
    update i set       
        ownership_id = @ownership_id,      
        location_id = @location_id,
        branch_id = @location_branch              
    from incident i        
        join @incidents item on item.id = i.id      
    where isnull(i.branch_id, -1) = @branch_id        
        and date between @ownership_date and @end_date        
        and ownership_id is null        
        
end