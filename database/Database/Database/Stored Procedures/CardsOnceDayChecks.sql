CREATE procedure CardsOnceDayChecks
as
begin
    exec ArchiveChildCards
    exec CorrectCardOutOfParentStep
end