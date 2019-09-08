CREATE TABLE [dbo].[timezone] (
    [id]            INT           NOT NULL,
    [name]          VARCHAR (100) NULL,
    [gmt_variation] INT           NULL,
    PRIMARY KEY CLUSTERED ([id] ASC)
);

