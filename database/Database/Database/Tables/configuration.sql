CREATE TABLE [dbo].[configuration] (
    [id]                 INT           NOT NULL,
    [name]               VARCHAR (100) NOT NULL,
    [value]              VARCHAR (MAX) NOT NULL,
    [configuration_type] INT           NOT NULL,
    PRIMARY KEY CLUSTERED ([id] ASC)
);

