CREATE TABLE [dbo].[currency] (
    [id]     INT           IDENTITY (1, 1) NOT NULL,
    [name]   VARCHAR (100) NULL,
    [symbol] VARCHAR (3)   NULL,
    PRIMARY KEY CLUSTERED ([id] ASC)
);

