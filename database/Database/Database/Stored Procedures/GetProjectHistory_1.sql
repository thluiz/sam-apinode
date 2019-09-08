CREATE procedure GetProjectHistory(@project_id int)
as
begin
	select 
		(select ch.* 
		from card children 
			join vwCardHistory ch on ch.card_id = children.id
		where parent_id = @project_id
		for json path) children_history,
		(
		select * 
		from vwCardHistory
		for json path
		) history
	for json path

end