CREATE TABLE [dbo].[branch_map_schedule] (
    [id]            INT IDENTITY (1, 1) NOT NULL,
    [branch_map_id] INT NOT NULL,
    [week_day]      INT NOT NULL,
    PRIMARY KEY CLUSTERED ([id] ASC),
    CONSTRAINT [fk_branch_map_schedule_branch_map] FOREIGN KEY ([branch_map_id]) REFERENCES [dbo].[branch_map] ([id])
);

