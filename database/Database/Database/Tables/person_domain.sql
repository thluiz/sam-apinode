CREATE TABLE [dbo].[person_domain] (
    [id]               INT IDENTITY (1, 1) NOT NULL,
    [person_id]        INT NOT NULL,
    [domain_id]        INT NOT NULL,
    [financial_status] INT DEFAULT ((0)) NOT NULL,
    PRIMARY KEY CLUSTERED ([id] ASC),
    CONSTRAINT [fk_person_domain_domain] FOREIGN KEY ([domain_id]) REFERENCES [dbo].[domain] ([id]),
    CONSTRAINT [fk_person_domain_enum_person_domain_financial_status] FOREIGN KEY ([financial_status]) REFERENCES [dbo].[enum_person_domain_financial_status] ([id]),
    CONSTRAINT [fk_person_domain_person] FOREIGN KEY ([person_id]) REFERENCES [dbo].[person] ([id])
);

