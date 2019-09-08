CREATE TABLE [dbo].[person_user_configuration] (
    [id]                    INT           IDENTITY (1, 1) NOT NULL,
    [person_id]             INT           NOT NULL,
    [user_configuration_id] INT           NOT NULL,
    [value]                 VARCHAR (100) NULL,
    PRIMARY KEY CLUSTERED ([id] ASC)
);

