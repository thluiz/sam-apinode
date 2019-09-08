CREATE TABLE [dbo].[month] (
    [id]    INT  IDENTITY (1, 1) NOT NULL,
    [month] INT  NOT NULL,
    [year]  INT  NOT NULL,
    [start] DATE NOT NULL,
    [end]   DATE NOT NULL,
    PRIMARY KEY CLUSTERED ([id] ASC)
);


GO
CREATE NONCLUSTERED INDEX [idx_months]
    ON [dbo].[month]([month] ASC, [year] ASC);


GO
CREATE NONCLUSTERED INDEX [idx_month_dates]
    ON [dbo].[month]([start] ASC, [end] ASC);

