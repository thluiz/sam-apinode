CREATE TABLE [dbo].[person_domain_financial_agreement] (
    [id]                     INT IDENTITY (1, 1) NOT NULL,
    [person_domain_id]       INT NOT NULL,
    [financial_agreement_id] INT NOT NULL,
    PRIMARY KEY CLUSTERED ([id] ASC),
    CONSTRAINT [fk_person_domain_financial_agreement_financial_agreement] FOREIGN KEY ([financial_agreement_id]) REFERENCES [dbo].[financial_agreement] ([id]),
    CONSTRAINT [fk_person_domain_financial_agreement_person_domain] FOREIGN KEY ([person_domain_id]) REFERENCES [dbo].[person_domain] ([id])
);

