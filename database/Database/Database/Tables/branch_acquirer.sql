CREATE TABLE [dbo].[branch_acquirer] (
    [id]          INT IDENTITY (1, 1) NOT NULL,
    [branch_id]   INT NULL,
    [acquirer_id] INT NULL,
    PRIMARY KEY CLUSTERED ([id] ASC)
);

