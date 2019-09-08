CREATE TABLE [dbo].[incident_action_incident] (
    [id]                 INT      IDENTITY (1, 1) NOT NULL,
    [incident_action_id] INT      NOT NULL,
    [incident_id]        INT      NOT NULL,
    [created_at]         DATETIME DEFAULT (getdate()) NOT NULL,
    [treated]            BIT      DEFAULT ((0)) NOT NULL,
    [treated_at]         DATETIME NULL,
    [treated_by]         INT      NULL,
    PRIMARY KEY CLUSTERED ([id] ASC),
    CONSTRAINT [fk_incident_action_incident_incident] FOREIGN KEY ([incident_id]) REFERENCES [dbo].[incident] ([id]),
    CONSTRAINT [fk_incident_action_incident_incident_action] FOREIGN KEY ([incident_action_id]) REFERENCES [dbo].[incident_action] ([id])
);


GO
CREATE UNIQUE NONCLUSTERED INDEX [uk_incident_action_incindent]
    ON [dbo].[incident_action_incident]([incident_action_id] ASC, [incident_id] ASC);


GO
CREATE NONCLUSTERED INDEX [ix_incident_action_incident2]
    ON [dbo].[incident_action_incident]([incident_action_id] ASC);


GO
CREATE NONCLUSTERED INDEX [ix_incident_action_incident]
    ON [dbo].[incident_action_incident]([incident_id] ASC);

