CREATE TABLE [dbo].[role] (
    [id]                     INT          IDENTITY (1, 1) NOT NULL,
    [name]                   VARCHAR (50) NULL,
    [allowed_for_new_person] BIT          DEFAULT ((0)) NOT NULL,
    PRIMARY KEY CLUSTERED ([id] ASC)
);

