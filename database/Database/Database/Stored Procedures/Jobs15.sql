CREATE procedure Jobs15  
as  
begin  
    exec CheckPeopleComunicationStatus  
    exec CheckPeopleStatus  
    exec CheckPeopleFinancialStatus  
    exec CheckPeopleSchedulingStatus  
    exec GetPersonOfferingAvailable @save_data = 1  
    exec UpdatePeopleIncidents
  
    exec CheckCardsHasOverdueCards  
end