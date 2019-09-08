CREATE procedure ToggleBranchAcquirerAssociation(
@branch_id int,
@acquirer_id int
)
as
begin

	if(exists(select 1 from branch_acquirer where branch_id = @branch_id and acquirer_id = @acquirer_id))
	begin
		delete from branch_acquirer where branch_id = @branch_id and acquirer_id = @acquirer_id
		return
	end
	
	insert into branch_acquirer(branch_id, acquirer_id) values (@branch_id, @acquirer_id)


end