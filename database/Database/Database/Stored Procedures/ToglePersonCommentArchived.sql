
CREATE procedure [dbo].[ToglePersonCommentArchived](
	@comment_id int
) as
begin

	update person_comment set archived = case when archived = 1 then 0 else 1 end
	where id = @comment_id

	

end