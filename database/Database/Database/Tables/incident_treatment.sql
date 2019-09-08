CREATE TABLE [dbo].[incident_treatment] (
    [id]              INT           IDENTITY (1, 1) NOT NULL,
    [incident_id]     INT           NOT NULL,
    [person_id]       INT           NULL,
    [treatment_type]  INT           NOT NULL,
    [description]     VARCHAR (MAX) NULL,
    [new_incident_id] INT           NULL,
    [created_on]      DATETIME      DEFAULT (getUTCdate()) NOT NULL,
    PRIMARY KEY CLUSTERED ([id] ASC),
    CONSTRAINT [FK_incident_treatment_incident] FOREIGN KEY ([incident_id]) REFERENCES [dbo].[incident] ([id]),
    CONSTRAINT [FK_incident_treatment_person] FOREIGN KEY ([person_id]) REFERENCES [dbo].[person] ([id])
);




GO
CREATE NONCLUSTERED INDEX [ix_incident_treatment_incident_id]
    ON [dbo].[incident_treatment]([incident_id] ASC);


GO
CREATE NONCLUSTERED INDEX [ix_incident_treatment_new_incident_id]
    ON [dbo].[incident_treatment]([new_incident_id] ASC);

