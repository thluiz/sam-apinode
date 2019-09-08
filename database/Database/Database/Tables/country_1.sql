CREATE TABLE [dbo].[country] (
    [id]          INT           IDENTITY (1, 1) NOT NULL,
    [name]        VARCHAR (100) NULL,
    [order]       INT           DEFAULT ((0)) NOT NULL,
    [currency_id] INT           DEFAULT ((1)) NOT NULL,
    PRIMARY KEY CLUSTERED ([id] ASC),
    CONSTRAINT [fk_country_currency] FOREIGN KEY ([currency_id]) REFERENCES [dbo].[currency] ([id])
);

