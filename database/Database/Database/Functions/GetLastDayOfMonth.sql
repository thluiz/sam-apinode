create function GetLastDayOfMonth(@year int, @month int)
returns date
as
begin
    declare @last_day date = dateadd(day, -1, dateadd(month, 1, datefromparts(@year, @month, 1)))

    return @last_day

end