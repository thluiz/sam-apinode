CREATE TABLE [dbo].[ownership_incident_type] (
    [id]            INT IDENTITY (1, 1) NOT NULL,
    [incident_id]   INT NOT NULL,
    [incident_type] INT NOT NULL,
    PRIMARY KEY CLUSTERED ([id] ASC),
    CONSTRAINT [fk_ownership_incident_type_incident] FOREIGN KEY ([incident_id]) REFERENCES [dbo].[incident] ([id]),
    CONSTRAINT [fk_ownership_incident_type_type] FOREIGN KEY ([incident_type]) REFERENCES [dbo].[enum_incident_type] ([id])
);

