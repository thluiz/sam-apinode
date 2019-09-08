CREATE TABLE [dbo].[person_partnership] (
    [id]           INT            IDENTITY (1, 1) NOT NULL,
    [name]         NVARCHAR (250) NULL,
    [person_id]    INT            NOT NULL,
    [date_created] DATETIME       DEFAULT (getUTCdate()) NOT NULL,
    [description]  NVARCHAR (MAX) NULL,
    [commentary]   NVARCHAR (MAX) NULL,
    [card_id]      INT            NULL,
    PRIMARY KEY CLUSTERED ([id] ASC),
    CONSTRAINT [fk_person_partnership_person] FOREIGN KEY ([person_id]) REFERENCES [dbo].[person] ([id])
);

