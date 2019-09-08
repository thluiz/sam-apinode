CREATE TABLE [dbo].[recurrence_type] (
    [id]          INT          NOT NULL,
    [description] VARCHAR (50) NULL,
    [active]      BIT          DEFAULT ((0)) NOT NULL,
    PRIMARY KEY CLUSTERED ([id] ASC)
);

