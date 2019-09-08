CREATE TABLE [dbo].[incident_action_configuration] (
    [id]                   INT            IDENTITY (1, 1) NOT NULL,
    [title]                NVARCHAR (200) NOT NULL,
    [location_id]          INT            NULL,
    [incident_action_type] INT            NOT NULL,
    [description]          NVARCHAR (MAX) NULL,
    [created_on]           DATETIME       DEFAULT (getUTCdate()) NOT NULL,
    [created_by]           INT            NOT NULL,
    [archived]             BIT            DEFAULT ((0)) NOT NULL,
    [archived_by]          INT            NULL,
    [archived_on]          DATETIME       NULL,
    [incident_type]        INT            NOT NULL,
    PRIMARY KEY CLUSTERED ([id] ASC),
    CONSTRAINT [fk_incident_action_configuration_archived_by] FOREIGN KEY ([archived_by]) REFERENCES [dbo].[person] ([id]),
    CONSTRAINT [fk_incident_action_configuration_created_by] FOREIGN KEY ([created_by]) REFERENCES [dbo].[person] ([id]),
    CONSTRAINT [fk_incident_action_configuration_incident_action_type] FOREIGN KEY ([incident_action_type]) REFERENCES [dbo].[incident_action_type] ([id]),
    CONSTRAINT [fk_incident_action_configuration_incident_type] FOREIGN KEY ([incident_type]) REFERENCES [dbo].[enum_incident_type] ([id]),
    CONSTRAINT [fk_incident_action_configuration_location] FOREIGN KEY ([location_id]) REFERENCES [dbo].[location] ([id])
);

