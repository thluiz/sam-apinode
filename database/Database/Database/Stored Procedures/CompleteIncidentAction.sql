create procedure CompleteIncidentAction(@action_id int, @responsible_id int)
as
begin

    update incident_action set completed = 1, completed_at = getUTCDate(), completed_by = @responsible_id
    where id = @action_id

    select *
    from vwIncidentAction v
    where v.id = @action_id
    for json path

end