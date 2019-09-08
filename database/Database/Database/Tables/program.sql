CREATE TABLE [dbo].[program] (
    [id]        INT           IDENTITY (1, 1) NOT NULL,
    [name]      VARCHAR (100) NULL,
    [long_name] VARCHAR (200) NULL,
    PRIMARY KEY CLUSTERED ([id] ASC)
);

