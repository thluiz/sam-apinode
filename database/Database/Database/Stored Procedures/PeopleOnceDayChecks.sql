create procedure PeopleOnceDayChecks
as
begin
    exec GenerateBirthDateIncidents
    exec CancelExpiredPeopleScheduling
end