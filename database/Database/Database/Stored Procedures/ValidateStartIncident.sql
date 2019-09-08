CREATE procedure ValidateStartIncident(@incident int)
as
begin

 declare @card_id int, @ownership_id int, @incident_type int
            
  select @card_id = card_id, @ownership_id = ownership_id, @incident_type = incident_type
  from incident where id = @incident       
  
     
 if(@incident_type != 36)
 begin
    if(@ownership_id is null)
    begin
        exec GenerateFailMessage 'O evento precisa estar numa titularidade para ser iniciado'
        return
    end

    declare @ownership_start datetime, @ownership_end datetime
    
    select @ownership_start = started_on, @ownership_end = closed_on 
    from incident 
    where id = @ownership_id

    if(@ownership_start is null)
    begin
        exec GenerateFailMessage 'A titularidade precisa ser iniciada antes desse evento'
        return
    end

    if(@ownership_end is not null)
    begin
        exec GenerateFailMessage 'A titularidade já está fechada - não é possível iniciar novos eventos nela'
        return
    end

 end

 select cast(1 as bit) success
 for json path

end