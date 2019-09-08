CREATE TABLE [dbo].[members_sumary] (
    [id]                  INT      IDENTITY (1, 1) NOT NULL,
    [date]                DATETIME NULL,
    [branch_id]           INT      NOT NULL,
    [program_id]          INT      NOT NULL,
    [people]              INT      NOT NULL,
    [financial_issues]    INT      NOT NULL,
    [scheduling_issues]   INT      NOT NULL,
    [comunication_issues] INT      NOT NULL,
    [week_id]             INT      NULL,
    [month_id]            INT      NULL,
    PRIMARY KEY CLUSTERED ([id] ASC) WITH (FILLFACTOR = 100),
    CONSTRAINT [fk_members_sumary_month] FOREIGN KEY ([month_id]) REFERENCES [dbo].[month] ([id]),
    CONSTRAINT [fk_members_sumary_week] FOREIGN KEY ([week_id]) REFERENCES [dbo].[week] ([id])
);




GO
CREATE NONCLUSTERED INDEX [nci_wi_members_sumary_C8D2076469AC5241871E0FE774817E72]
    ON [dbo].[members_sumary]([week_id] ASC, [program_id] ASC)
    INCLUDE([branch_id], [comunication_issues], [financial_issues], [people], [scheduling_issues]) WITH (FILLFACTOR = 100);

