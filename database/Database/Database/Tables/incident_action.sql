CREATE TABLE [dbo].[incident_action] (
    [id]                               INT            IDENTITY (1, 1) NOT NULL,
    [incident_action_configuration_id] INT            NULL,
    [location_id]                      INT            NULL,
    [incident_action_type]             INT            NOT NULL,
    [title]                            NVARCHAR (200) NOT NULL,
    [description]                      NVARCHAR (MAX) NULL,
    [completed]                        BIT            DEFAULT ((0)) NOT NULL,
    [completed_by]                     INT            NULL,
    [treated]                          BIT            DEFAULT ((0)) NOT NULL,
    [treated_by]                       INT            NULL,
    [original_incident_action_id]      INT            NULL,
    [created_at]                       DATETIME       DEFAULT (getutcdate()) NOT NULL,
    [created_by]                       INT            NOT NULL,
    [completed_at]                     DATETIME       NULL,
    [treated_at]                       DATETIME       NULL,
    [cancelled_at]                     DATETIME       NULL,
    [cancelled]                        BIT            DEFAULT ((0)) NOT NULL,
    [cancelled_by]                     INT            NULL,
    [treated_until]                    DATETIME       NULL,
    PRIMARY KEY CLUSTERED ([id] ASC),
    CONSTRAINT [fk_incident_action_completed_by] FOREIGN KEY ([completed_by]) REFERENCES [dbo].[person] ([id]),
    CONSTRAINT [fk_incident_action_incident_action_configuration] FOREIGN KEY ([incident_action_configuration_id]) REFERENCES [dbo].[incident_action_configuration] ([id]),
    CONSTRAINT [fk_incident_action_incident_action_type] FOREIGN KEY ([incident_action_type]) REFERENCES [dbo].[incident_action_type] ([id]),
    CONSTRAINT [fk_incident_action_location] FOREIGN KEY ([location_id]) REFERENCES [dbo].[location] ([id]),
    CONSTRAINT [fk_incident_action_treated_by] FOREIGN KEY ([treated_by]) REFERENCES [dbo].[person] ([id])
);




GO
CREATE NONCLUSTERED INDEX [ix_incident_action_cancelled]
    ON [dbo].[incident_action]([cancelled] ASC);

