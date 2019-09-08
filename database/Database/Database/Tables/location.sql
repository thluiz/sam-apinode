CREATE TABLE [dbo].[location] (
    [id]          INT            IDENTITY (1, 1) NOT NULL,
    [name]        VARCHAR (100)  NULL,
    [description] NVARCHAR (MAX) NULL,
    [active]      BIT            DEFAULT ((1)) NOT NULL,
    [order]       INT            DEFAULT ((0)) NOT NULL,
    [country_id]  INT            DEFAULT ((1)) NOT NULL,
    [branch_id]   INT            NULL,
    [timezone_id] INT            DEFAULT ((1)) NOT NULL,
    PRIMARY KEY CLUSTERED ([id] ASC)
);







