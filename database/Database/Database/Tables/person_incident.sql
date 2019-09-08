CREATE TABLE [dbo].[person_incident] (
    [id]                 INT IDENTITY (1, 1) NOT NULL,
    [person_id]          INT NULL,
    [incident_id]        INT NULL,
    [participation_type] INT DEFAULT ((0)) NOT NULL,
    [closed]             BIT DEFAULT ((0)) NOT NULL,
    PRIMARY KEY CLUSTERED ([id] ASC),
    CONSTRAINT [FK_person_incident_incident] FOREIGN KEY ([incident_id]) REFERENCES [dbo].[incident] ([id]),
    CONSTRAINT [FK_person_incident_person] FOREIGN KEY ([person_id]) REFERENCES [dbo].[person] ([id])
);




GO
CREATE NONCLUSTERED INDEX [idx_person_incident]
    ON [dbo].[person_incident]([person_id] ASC, [incident_id] ASC);


GO
CREATE NONCLUSTERED INDEX [ix_person_incident]
    ON [dbo].[person_incident]([incident_id] ASC)
    INCLUDE([person_id]);

