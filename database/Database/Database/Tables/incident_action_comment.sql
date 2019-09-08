CREATE TABLE [dbo].[incident_action_comment] (
    [id]                 INT            IDENTITY (1, 1) NOT NULL,
    [incident_action_id] INT            NOT NULL,
    [comment]            NVARCHAR (MAX) NOT NULL,
    [created_by]         INT            NOT NULL,
    [created_at]         DATETIME       DEFAULT (getutcdate()) NOT NULL,
    [archived]           BIT            DEFAULT ((0)) NOT NULL,
    [archived_by]        INT            NULL,
    [archived_on]        DATETIME       NULL,
    [comment_type]       INT            DEFAULT ((0)) NOT NULL,
    PRIMARY KEY CLUSTERED ([id] ASC),
    CONSTRAINT [fk_incident_action_comment_incident_action] FOREIGN KEY ([incident_action_id]) REFERENCES [dbo].[incident_action] ([id]),
    CONSTRAINT [fk_incident_action_created_by] FOREIGN KEY ([created_by]) REFERENCES [dbo].[person] ([id])
);




GO
CREATE NONCLUSTERED INDEX [ix_incident_action_comment_incident_action]
    ON [dbo].[incident_action_comment]([incident_action_id] ASC, [archived] ASC);

