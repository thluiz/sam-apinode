CREATE TABLE [dbo].[external_branch] (
    [id]    INT            IDENTITY (1, 1) NOT NULL,
    [name]  NVARCHAR (250) NULL,
    [email] VARCHAR (250)  NULL,
    PRIMARY KEY CLUSTERED ([id] ASC)
);

