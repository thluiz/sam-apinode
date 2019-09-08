CREATE TABLE [dbo].[financial_agreement] (
    [id]                INT             IDENTITY (1, 1) NOT NULL,
    [responsible_id]    INT             NOT NULL,
    [person_id]         INT             NOT NULL,
    [currency_id]       INT             NOT NULL,
    [full_value]        DECIMAL (12, 2) NOT NULL,
    [remanescent_value] DECIMAL (12, 2) DEFAULT ((0)) NOT NULL,
    [product_id]        INT             NOT NULL,
    [created_on]        DATETIME        DEFAULT (getUTCdate()) NOT NULL,
    [archived]          BIT             DEFAULT ((0)) NOT NULL,
    [branch_product_id] INT             NULL,
    [end_date]          DATETIME        NOT NULL,
    [cover_until]       DATETIME        NOT NULL,
    PRIMARY KEY CLUSTERED ([id] ASC),
    CONSTRAINT [fk_financial_agreement_person] FOREIGN KEY ([person_id]) REFERENCES [dbo].[person] ([id]),
    CONSTRAINT [fk_financial_agreenment_responsible] FOREIGN KEY ([responsible_id]) REFERENCES [dbo].[person] ([id])
);



