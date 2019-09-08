
CREATE procedure GetPreviousMonthPayments
as
begin
    declare @previous_month int = (select datepart(month, dateadd(month, -1, getdate()))),
            @previous_year int = (select datepart(year, dateadd(month, -1, getdate())))
        
    declare @last_day date = dbo.GetLastDayOfMonth(@previous_year, @previous_month)

    select b.abrev branch, cast(i.date as date) due_date, case when i.closed_on is null then '' else  
        cast(cast(i.closed_on as date) as varchar(10)) end closed_on,  p.name person, 
        eit.name type, isnull(i.value, i.fund_value) fund_value, isnull(i.title, '') title, isnull(i.description, '') [description]
    from vwPerson p
	    join person_incident pic on pic.person_id = p.id
	    join incident i on i.id = pic.incident_id
	    join enum_incident_type eit on eit.id = i.incident_type
        join branch b on b.id = i.branch_id
    where eit.financial_type > 0
	    and cancelled = 0
	    and i.treated = 0		
        and cast(i.date as date) between DATEFROMPARTS(@previous_year, @previous_month, 1) and @last_day
    order by b.name, cast(i.closed_on as date), cast(i.date as date)
    for json path
end