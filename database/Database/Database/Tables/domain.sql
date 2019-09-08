CREATE TABLE [dbo].[domain] (
    [id]              INT           IDENTITY (1, 1) NOT NULL,
    [name]            VARCHAR (100) NULL,
    [traditional]     BIT           DEFAULT ((0)) NOT NULL,
    [abrev]           VARCHAR (10)  NOT NULL,
    [order]           INT           DEFAULT ((10)) NOT NULL,
    [long_name]       VARCHAR (100) NULL,
    [program_id]      INT           DEFAULT ((1)) NOT NULL,
    [extra_long_name] VARCHAR (350) NULL,
    [ideograms]       NVARCHAR (50) NULL,
    [sessions]        INT           DEFAULT ((0)) NOT NULL,
    PRIMARY KEY CLUSTERED ([id] ASC)
);



