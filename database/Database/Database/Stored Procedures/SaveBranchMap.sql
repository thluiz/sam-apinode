
CREATE procedure [dbo].[SaveBranchMap](
	@id int, @branch_id int, @incident_type_id int, @receive_voucher bit,
	@week_days varchar(max), @title varchar(200),
	@end_hour int, @end_minute int,
	@start_hour int, @start_minute int
)
as
begin
	if(@incident_type_id != 10)
		set @receive_voucher = 0

	declare @description varchar(max) = isnull(@title + ' - ', '')

	set @description += (select name from enum_incident_type where id = @incident_type_id)

	if(@receive_voucher = 1) 
		set @description += '(Voucher)';

	
	set @description += ' - ' + stuff( (SELECT ',' + wkn.abrev 
								from dbo.Split(@week_days, ',') sp
									join week_day_name wkn on sp.item = wkn.number             				
								ORDER BY wkn.number
								FOR XML PATH(''), TYPE).value('.', 'varchar(max)') ,1,1,'')


	set @description += ' de ' + cast(@start_hour as varchar(2)) + ':' + right('00' + cast(@start_minute as varchar(2)), 2)
						+ ' às ' + cast(@end_hour as varchar(2)) + ':' +  right('00' + cast(@end_minute as varchar(2)), 2)

    

	if(@id > 0)
	begin
		update branch_map set 
			incident_type = @incident_type_id,
			receive_voucher = @receive_voucher,
			title = @title,
			start_hour = @start_hour,
			start_minute = @start_minute,
			end_hour = @end_hour,
			end_minute = @end_minute,
			base_description = @description
		where id = @id
	end
	else 
	begin
		insert into branch_map(
			branch_id, title, receive_voucher, active, incident_type, 
			start_hour, start_minute, end_hour, end_minute, base_description
		) values (
			@branch_id, @title, @receive_voucher, 1, @incident_type_id,
			@start_hour, @start_minute, @end_hour, @end_minute, @description
		)

		set @id = @@IDENTITY
	end

	delete from branch_map_schedule where branch_map_id = @id
	
	insert into branch_map_schedule(branch_map_id, week_day)
		select @id, Item
		from dbo.Split(@week_days, ',')		
end