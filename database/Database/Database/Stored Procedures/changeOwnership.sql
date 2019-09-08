CREATE procedure [changeOwnership](
@ownership_id int,
@owner_id int,
@first_surrogate_id int,
@second_surrogate_id int,
@responsible_id int,
@description nvarchar(max)
)
as
begin

    declare @old_owner_id int, @old_owner_pic_id int, 
                @old_first_id int, @old_first_incident_id int,
                @old_second_id int, @old_second_incident_id int,
                @old_owner_name nvarchar(250), @owner_name nvarchar(250),
                @old_first_name nvarchar(250), @first_name nvarchar(250),
                @old_second_name nvarchar(250), @second_name nvarchar(250),
                @ownership_date datetime, @ownership_started_on datetime, @tz_variation int,
                @location_id int
                
    
    set @description = '**Alteração de Titularidade** ' + isnull(char(10) + char(13) + '_' + @description + '_', '')

    select @old_owner_id = pic.person_id, @old_owner_pic_id = pic.id, @old_owner_name = isnull(p.alias, p.name),
            @tz_variation = tz.gmt_variation, @ownership_date = date, @ownership_started_on = started_on,
            @location_id = location_id
    from incident i 
        join person_incident pic on pic.incident_id = i.id
        join person p on p.id = pic.person_id
        left join location l on l.id = i.location_id
        left join timezone tz on tz.id = l.timezone_id
    where i.id = @ownership_id
    
    select @owner_name = isnull(p.alias, p.name)
    from person p
    where id = @owner_id

    select @first_name = isnull(p.alias, p.name)
    from person p
    where id = @first_surrogate_id

    select @second_name = isnull(p.alias, p.name)
    from person p
    where id = @second_surrogate_id            

    select ROW_NUMBER() over (order by sr.date, sr.id) num, *   
    into #surrogates  
    from vwLightIncident sr  
    where id in (  
        select top 2 i.id  
        from incident i          
        where ownership_id = @ownership_id  
            and incident_type = 39  
            and cancelled = 0
            and treated = 0
            and closed = 0
        order by date, id  
    ) 

    select top 1 @old_first_id = person_id, @old_first_incident_id = id, @old_first_name = person
    from #surrogates  
    where num = 1  

    select top 1 @old_second_id = person_id, @old_second_incident_id = id, @old_second_name = person
    from #surrogates  
    where num = 2  

    if(@old_owner_id != @owner_id)
    begin
        update pic set pic.person_id = @owner_id
        from person_incident pic where pic.id = @old_owner_pic_id
        
        set @description = @description + char(10) + char(13) + ' - Troca de Titular: "' + @old_owner_name + '" para "' + @owner_name + '"'         
    end

    if(@old_first_id is not null and @first_surrogate_id is not null and @old_first_id != @first_surrogate_id)
    begin
        update pic set pic.person_id = @first_surrogate_id
        from person_incident pic             
        where pic.incident_id = @old_first_incident_id

        set @description = @description + char(10) + char(13) + ' - Troca de primeiro suplente: "' + @old_first_name + '" para "' + @first_name + '"'  
    end

    if(@old_second_id is not null and @second_surrogate_id is not null and @old_second_id != @second_surrogate_id)
    begin
        update pic set pic.person_id = @second_surrogate_id
        from person_incident pic             
        where pic.incident_id = @old_second_incident_id
        
        set @description = @description + char(10) + char(13) + ' - Troca de segundo suplente: "' + @old_second_name + '" para "' + @second_name + '"'
    end

    if(@old_first_id is null and @first_surrogate_id is not null)
    begin
        insert into incident(date, incident_type, started_on, ownership_id, responsible_id, location_id)
        values(
            case when @ownership_started_on is not null then 
                dateadd(hour, @tz_variation, getdate())
            else @ownership_date end, 39, null, @ownership_id,
            @responsible_id, @location_id
        )

        declare @new_first_surrogate_id int = @@identity

        insert into person_incident (incident_id, person_id)
        values( @new_first_surrogate_id, @first_surrogate_id)
        
        set @description = @description + char(10) + char(13) + ' - Adicionado primeiro suplente: "' + @first_name + '"'
    end

    if(@old_second_id is null and @second_surrogate_id is not null)
    begin
        insert into incident(date, incident_type, started_on, ownership_id, responsible_id, location_id)
        values(
            case when @ownership_started_on is not null then 
                dateadd(hour, @tz_variation, getdate())
            else @ownership_date end, 39, null, @ownership_id,
            @responsible_id, @location_id
        )

        declare @new_second_surrogate_id int = @@identity

        insert into person_incident (incident_id, person_id)
        values( @new_second_surrogate_id, @second_surrogate_id)
                
        set @description = @description + char(10) + char(13) + ' - Adicionado segundo suplente: "' + @second_name + '"' 
    end  
    
    if(@old_first_id is not null and @first_surrogate_id is null)
    begin
        update i set i.treated = 1        
        from incident i         
        where i.id = @old_first_incident_id
                
        set @description = @description + char(10) + char(13) + ' - Removido primeiro suplente: "' + @old_first_name + '"' 
    end

    if(@old_second_id is not null and @second_surrogate_id is null)
    begin
        update i set i.treated = 1        
        from incident i         
        where i.id = @old_second_incident_id
        
        set @description = @description + char(10) + char(13) + ' - Removido segundo suplente: "' + @old_second_name + '"'
    end  

    insert into incident_comment(incident_id, responsible_id, comment) 
        values (@ownership_id, @responsible_id, @description)

    select cast(1 as bit) success,                                                
        (select *         
        from vwLightIncident l          
        where l.id = @ownership_id                                    
        for json path) ownership,                       
        (select *                
        from vwLightIncident                 
        where id in (                
            select i2.id                 
            from incident i2 (nolock)                
            where i2.incident_type != 36                
            and i2.cancelled = 0                                   
            and i2.ownership_id = @ownership_id)                
        for json path                
        ) incidents      
    for json path 
end