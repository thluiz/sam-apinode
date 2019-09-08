
CREATE  procedure [dbo].[ToglePersonCommentPinned](
	@comment_id int
) as
begin

	update person_comment set pinned = case when pinned = 1 then 0 else 1 end
	where id = @comment_id

    update p set p.pinned_comment_count = (select count(1) from person_comment pc2 where  pc2.person_id = p.id and pinned = 1 and archived = 0)
    from person p
    join person_comment pc on pc.person_id = p.id
    where pc.id = @comment_id

	select p.* from vwPerson p
        join person_comment pc on pc.person_id = p.id
    where pc.id = @comment_id
    for json PATH

end