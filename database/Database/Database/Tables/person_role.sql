CREATE TABLE [dbo].[person_role] (
    [role_id]   INT NOT NULL,
    [person_id] INT NOT NULL,
    CONSTRAINT [FK_person_role_person] FOREIGN KEY ([person_id]) REFERENCES [dbo].[person] ([id]),
    CONSTRAINT [FK_person_role_role] FOREIGN KEY ([role_id]) REFERENCES [dbo].[role] ([id])
);


GO
CREATE UNIQUE NONCLUSTERED INDEX [UK_Role_User]
    ON [dbo].[person_role]([role_id] ASC, [person_id] ASC);


GO
CREATE UNIQUE NONCLUSTERED INDEX [uk_person_role]
    ON [dbo].[person_role]([person_id] ASC, [role_id] ASC);


GO
CREATE NONCLUSTERED INDEX [idx_person_role_person]
    ON [dbo].[person_role]([person_id] ASC);

