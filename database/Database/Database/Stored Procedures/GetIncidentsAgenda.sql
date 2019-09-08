create procedure GetIncidentsAgenda
(@branch int = null,
@date date = null)
as
begin 

	if(@date is null)
	begin 
		set @date = dbo.getCurrentDate()
	end


end