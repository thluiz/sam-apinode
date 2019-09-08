CREATE TABLE [dbo].[group] (
    [id]              INT            IDENTITY (1, 1) NOT NULL,
    [name]            VARCHAR (100)  NOT NULL,
    [need_branch]     BIT            DEFAULT ((0)) NOT NULL,
    [allow_no_branch] BIT            DEFAULT ((0)) NOT NULL,
    [description]     NVARCHAR (500) NULL,
    [order]           INT            DEFAULT ((0)) NOT NULL,
    [active]          BIT            DEFAULT ((0)) NOT NULL,
    PRIMARY KEY CLUSTERED ([id] ASC)
);

