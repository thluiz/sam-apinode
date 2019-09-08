CREATE TABLE [dbo].[week] (
    [id]     INT  IDENTITY (1, 1) NOT NULL,
    [number] INT  NOT NULL,
    [start]  DATE NOT NULL,
    [end]    DATE NOT NULL,
    PRIMARY KEY CLUSTERED ([id] ASC)
);

