CREATE TABLE [dbo].[user_login] (
    [id]           INT           IDENTITY (1, 1) NOT NULL,
    [provider_key] VARCHAR (250) NULL,
    [user_id]      INT           NOT NULL,
    [login_data]   VARCHAR (MAX) NULL,
    PRIMARY KEY CLUSTERED ([id] ASC),
    CONSTRAINT [FK_User_user_login] FOREIGN KEY ([user_id]) REFERENCES [dbo].[user] ([id])
);

