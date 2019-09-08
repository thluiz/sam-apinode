CREATE TABLE [dbo].[card_history] (
    [id]                     INT            IDENTITY (1, 1) NOT NULL,
    [card_id]                INT            NOT NULL,
    [created_on]             DATETIME       DEFAULT (getUTCdate()) NOT NULL,
    [responsible_id]         INT            NOT NULL,
    [history_type]           INT            NOT NULL,
    [description]            NVARCHAR (MAX) NULL,
    [created_during_card_id] INT            NULL,
    [new_step_id]            INT            NULL,
    [new_parent_id]          INT            NULL,
    PRIMARY KEY CLUSTERED ([id] ASC),
    CONSTRAINT [fk_card_history_card] FOREIGN KEY ([card_id]) REFERENCES [dbo].[card] ([id]),
    CONSTRAINT [fk_card_history_type] FOREIGN KEY ([history_type]) REFERENCES [dbo].[enum_card_history_type] ([id]),
    CONSTRAINT [fk_card_history_user] FOREIGN KEY ([responsible_id]) REFERENCES [dbo].[person] ([id])
);






GO
CREATE NONCLUSTERED INDEX [ix_card_history_card]
    ON [dbo].[card_history]([card_id] ASC);

