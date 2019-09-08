CREATE procedure ValidateCloseIncident(@incident int)
as
begin 

    if(exists(select 1 
                from incident_action_incident iai 
                    join incident_action ia on ia.id = iai.incident_action_id
                where iai.incident_id = @incident
                    and iai.treated = 0
                    and ia.completed = 0))
    begin
        select cast(0 as bit) success, 'Atividade tem ações em aberto. Trate-as ou as encerre antes de finaliza-la.' message
        for json path
        return
    end

    select cast(1 as bit) success
    for json path

end