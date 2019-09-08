CREATE TABLE [dbo].[password_request] (
    [id]         INT            IDENTITY (1, 1) NOT NULL,
    [person_id]  INT            NOT NULL,
    [token]      NVARCHAR (150) NOT NULL,
    [created_at] DATETIME       DEFAULT (getdate()) NOT NULL,
    PRIMARY KEY CLUSTERED ([id] ASC),
    CONSTRAINT [fk_password_request_person] FOREIGN KEY ([person_id]) REFERENCES [dbo].[person] ([id])
);


GO
CREATE NONCLUSTERED INDEX [ix_password_request_token]
    ON [dbo].[password_request]([token] ASC);

