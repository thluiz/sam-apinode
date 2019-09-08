CREATE TABLE [dbo].[user] (
    [id]                INT              IDENTITY (1, 1) NOT NULL,
    [email]             VARCHAR (250)    NULL,
    [login_provider_id] INT              NOT NULL,
    [person_id]         INT              NOT NULL,
    [default_branch_id] INT              NULL,
    [token]             UNIQUEIDENTIFIER DEFAULT (newid()) NOT NULL,
    PRIMARY KEY CLUSTERED ([id] ASC),
    CONSTRAINT [FK_user_login_provider] FOREIGN KEY ([login_provider_id]) REFERENCES [dbo].[login_provider] ([id]),
    CONSTRAINT [fk_user_person] FOREIGN KEY ([person_id]) REFERENCES [dbo].[person] ([id])
);




GO
CREATE UNIQUE NONCLUSTERED INDEX [uk_user_email]
    ON [dbo].[user]([email] ASC, [login_provider_id] ASC);


GO
CREATE NONCLUSTERED INDEX [ix_user_token]
    ON [dbo].[user]([token] ASC);


GO
CREATE NONCLUSTERED INDEX [ix_user_email]
    ON [dbo].[user]([email] ASC);

