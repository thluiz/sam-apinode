create procedure ConsolidateSummaries
as
begin

    exec ConsolidateMembersSumary
    exec ConsolidateActivitySumary

end