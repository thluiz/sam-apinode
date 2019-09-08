create procedure GetBranchesTimezones
as
begin
    select b.id branch_id, t.id timezone_id, gmt_variation 
    from branch b (nolock)
        join timezone t (nolock) on t.id = b.timezone_id
    for json path
end