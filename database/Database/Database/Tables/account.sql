CREATE TABLE [dbo].[account] (
    [id]        INT           IDENTITY (1, 1) NOT NULL,
    [name]      VARCHAR (100) NOT NULL,
    [branch_id] INT           NULL,
    [active]    BIT           DEFAULT ((1)) NOT NULL,
    [order]     INT           DEFAULT ((0)) NOT NULL,
    [principal] BIT           DEFAULT ((0)) NOT NULL,
    PRIMARY KEY CLUSTERED ([id] ASC)
);

