CREATE TABLE [dbo].[person_schedule] (
    [id]                  INT             IDENTITY (1, 1) NOT NULL,
    [person_id]           INT             NOT NULL,
    [week_day]            INT             NULL,
    [start_hour]          INT             NULL,
    [start_minute]        INT             NULL,
    [active]              BIT             DEFAULT ((1)) NOT NULL,
    [schedule_type]       INT             DEFAULT ((1)) NOT NULL,
    [month_day]           INT             DEFAULT ((0)) NOT NULL,
    [value]               DECIMAL (12, 2) DEFAULT ((0)) NULL,
    [end_hour]            INT             NULL,
    [end_minute]          INT             NULL,
    [recurrence_type]     INT             DEFAULT ((0)) NOT NULL,
    [start_date]          DATE            DEFAULT (getUTCdate()) NOT NULL,
    [end_date]            DATE            NULL,
    [description]         NVARCHAR (MAX)  NULL,
    [number_of_incidents] INT             DEFAULT ((0)) NOT NULL,
    [confirmed_incidents] INT             DEFAULT ((0)) NOT NULL,
    [incident_type]       INT             NULL,
    [cancelled]           BIT             DEFAULT ((0)) NOT NULL,
    [cancelled_on]        DATETIME        NULL,
    [cancelled_by]        INT             NULL,
    [branch_id]           INT             NOT NULL,
    [responsible_id]      INT             NULL,
    PRIMARY KEY CLUSTERED ([id] ASC)
);



