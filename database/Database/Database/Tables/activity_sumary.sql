CREATE TABLE [dbo].[activity_sumary] (
    [id]            INT  IDENTITY (1, 1) NOT NULL,
    [date]          DATE NULL,
    [branch_id]     INT  NULL,
    [activity_type] INT  NOT NULL,
    [expected]      INT  DEFAULT ((0)) NOT NULL,
    [unexpected]    INT  DEFAULT ((0)) NOT NULL,
    [treated]       INT  DEFAULT ((0)) NOT NULL,
    [not_treated]   INT  DEFAULT ((0)) NOT NULL,
    [week_id]       INT  NULL,
    [month_id]      INT  NULL,
    [closed]        INT  DEFAULT ((0)) NOT NULL,
    PRIMARY KEY CLUSTERED ([id] ASC)
);

