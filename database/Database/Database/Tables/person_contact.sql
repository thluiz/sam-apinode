CREATE TABLE [dbo].[person_contact] (
    [id]           INT           IDENTITY (1, 1) NOT NULL,
    [contact_type] INT           NOT NULL,
    [person_id]    INT           NOT NULL,
    [contact]      VARCHAR (250) NOT NULL,
    [details]      VARCHAR (MAX) NULL,
    [principal]    BIT           DEFAULT ((0)) NOT NULL,
    [removed]      BIT           DEFAULT ((0)) NOT NULL,
    PRIMARY KEY CLUSTERED ([id] ASC),
    CONSTRAINT [fk_person_contact_contact_type] FOREIGN KEY ([contact_type]) REFERENCES [dbo].[enum_contact_type] ([id]),
    CONSTRAINT [fk_person_contact_person] FOREIGN KEY ([person_id]) REFERENCES [dbo].[person] ([id])
);




GO
CREATE NONCLUSTERED INDEX [idx_person_contact_person]
    ON [dbo].[person_contact]([person_id] ASC);


GO
CREATE NONCLUSTERED INDEX [idx_person_contact_removed]
    ON [dbo].[person_contact]([removed] ASC);


GO
CREATE NONCLUSTERED INDEX [idx_person_contact_principal_person]
    ON [dbo].[person_contact]([person_id] ASC, [principal] ASC);


GO
CREATE NONCLUSTERED INDEX [ix_person_contact_contact_type]
    ON [dbo].[person_contact]([contact_type] ASC);

