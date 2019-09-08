CREATE TABLE [dbo].[url] (
    [id]                INT           IDENTITY (1, 1) NOT NULL,
    [name]              VARCHAR (100) NOT NULL,
    [url]               VARCHAR (350) NOT NULL,
    [require_parameter] BIT           DEFAULT ((0)) NOT NULL,
    PRIMARY KEY CLUSTERED ([id] ASC)
);

