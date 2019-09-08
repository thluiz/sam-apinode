create procedure ExecuteCheckJobs
as
begin


	exec CheckCardsHasOverdueCards

	exec CheckPeopleComunicationStatus

	exec CheckPeopleFinancialStatus

	exec CheckPeopleSchedulingStatus

	exec CheckPeopleStatus

end