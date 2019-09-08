CREATE TABLE [dbo].[card_commentary] (
    [id]              INT            IDENTITY (1, 1) NOT NULL,
    [card_id]         INT            NOT NULL,
    [commentary]      NVARCHAR (MAX) NULL,
    [created_on]      DATETIME       DEFAULT (getUTCdate()) NOT NULL,
    [responsible_id]  INT            NULL,
    [archived]        BIT            DEFAULT ((0)) NOT NULL,
    [commentary_type] INT            DEFAULT ((1)) NOT NULL,
    PRIMARY KEY CLUSTERED ([id] ASC),
    CONSTRAINT [fk_card_commentary_card_commentary_type] FOREIGN KEY ([commentary_type]) REFERENCES [dbo].[card_commentary_type] ([id])
);






GO
CREATE NONCLUSTERED INDEX [ix_card_commentary_card]
    ON [dbo].[card_commentary]([card_id] ASC);

