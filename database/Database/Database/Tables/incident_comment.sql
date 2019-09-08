CREATE TABLE [dbo].[incident_comment] (
    [id]             INT            IDENTITY (1, 1) NOT NULL,
    [incident_id]    INT            NOT NULL,
    [comment]        NVARCHAR (MAX) NULL,
    [created_at]     DATETIME       DEFAULT (getUTCdate()) NOT NULL,
    [responsible_id] INT            NULL,
    [archived]       BIT            DEFAULT ((0)) NOT NULL,
    PRIMARY KEY CLUSTERED ([id] ASC),
    CONSTRAINT [fk_incident_comment_incident] FOREIGN KEY ([incident_id]) REFERENCES [dbo].[incident] ([id])
);


GO
CREATE NONCLUSTERED INDEX [ix_incident_comment]
    ON [dbo].[incident_comment]([incident_id] ASC, [archived] ASC);

