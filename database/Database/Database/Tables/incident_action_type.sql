CREATE TABLE [dbo].[incident_action_type] (
    [id]                       INT            IDENTITY (1, 1) NOT NULL,
    [name]                     NVARCHAR (100) NOT NULL,
    [add_to_person_as_comment] BIT            DEFAULT ((0)) NOT NULL,
    PRIMARY KEY CLUSTERED ([id] ASC)
);

