CREATE TABLE [dbo].[financial_agreement_installment] (
    [id]                     INT             IDENTITY (1, 1) NOT NULL,
    [financial_agreement_id] INT             NOT NULL,
    [value]                  DECIMAL (12, 2) NOT NULL,
    [due_date]               DATE            NOT NULL,
    [date]                   DATE            NULL,
    [responsible_id]         INT             NULL,
    PRIMARY KEY CLUSTERED ([id] ASC)
);

