CREATE TABLE [dbo].[country] (
    [id]    INT           IDENTITY (1, 1) NOT NULL,
    [name]  VARCHAR (100) NULL,
    [order] INT           DEFAULT ((0)) NOT NULL,
    PRIMARY KEY CLUSTERED ([id] ASC)
);

