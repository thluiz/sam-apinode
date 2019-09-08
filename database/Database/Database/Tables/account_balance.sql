CREATE TABLE [dbo].[account_balance] (
    [id]              INT             IDENTITY (1, 1) NOT NULL,
    [account_id]      INT             NOT NULL,
    [date]            DATE            NULL,
    [initial_balance] DECIMAL (12, 2) NOT NULL,
    [balance]         DECIMAL (12, 2) NOT NULL,
    [missing]         DECIMAL (12, 2) DEFAULT ((0)) NOT NULL,
    [total_missing]   DECIMAL (12, 2) DEFAULT ((0)) NOT NULL,
    PRIMARY KEY CLUSTERED ([id] ASC)
);


GO
CREATE NONCLUSTERED INDEX [ix_account_balance_date_account]
    ON [dbo].[account_balance]([account_id] ASC, [date] ASC);

