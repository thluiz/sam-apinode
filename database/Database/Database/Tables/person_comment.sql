CREATE TABLE [dbo].[person_comment] (
    [id]             INT            IDENTITY (1, 1) NOT NULL,
    [person_id]      INT            NOT NULL,
    [responsible_id] INT            NULL,
    [created_at]     DATETIME       DEFAULT (getUTCdate()) NOT NULL,
    [comment]        NVARCHAR (MAX) NULL,
    [pinned]         BIT            DEFAULT ((0)) NOT NULL,
    [archived]       BIT            DEFAULT ((0)) NOT NULL,
    PRIMARY KEY CLUSTERED ([id] ASC),
    CONSTRAINT [fk_person_comment_person] FOREIGN KEY ([person_id]) REFERENCES [dbo].[person] ([id]),
    CONSTRAINT [fk_person_comment_responsible] FOREIGN KEY ([responsible_id]) REFERENCES [dbo].[person] ([id])
);


GO
CREATE NONCLUSTERED INDEX [idx_person_comment_person]
    ON [dbo].[person_comment]([person_id] ASC);


GO
CREATE NONCLUSTERED INDEX [idx_person_comment_date]
    ON [dbo].[person_comment]([created_at] DESC);


GO
CREATE NONCLUSTERED INDEX [idx_person_comment_pinned]
    ON [dbo].[person_comment]([pinned] ASC, [person_id] ASC, [created_at] DESC, [archived] ASC);


GO
CREATE NONCLUSTERED INDEX [idx_person_comment_archived]
    ON [dbo].[person_comment]([person_id] ASC, [archived] ASC);

