CREATE TABLE [dbo].[card_step] (
    [id]                       INT           IDENTITY (1, 1) NOT NULL,
    [name]                     VARCHAR (150) NULL,
    [card_id]                  INT           NOT NULL,
    [order]                    INT           DEFAULT ((0)) NOT NULL,
    [need_due_date]            BIT           DEFAULT ((0)) NOT NULL,
    [need_action]              BIT           DEFAULT ((0)) NOT NULL,
    [is_blocking_step]         BIT           DEFAULT ((0)) NOT NULL,
    [is_closing_step]          BIT           DEFAULT ((0)) NOT NULL,
    [archived]                 BIT           DEFAULT ((0)) NOT NULL,
    [is_negative_closing_step] BIT           DEFAULT ((0)) NOT NULL,
    [generate_incident]        BIT           DEFAULT ((0)) NOT NULL,
    [close_financial_incident] BIT           DEFAULT ((0)) NOT NULL,
    [start_incident]           BIT           DEFAULT ((0)) NOT NULL,
    [initial_step]             BIT           DEFAULT ((0)) NOT NULL,
    [automatically_move]       BIT           DEFAULT ((0)) NOT NULL,
    PRIMARY KEY CLUSTERED ([id] ASC),
    CONSTRAINT [fk_card_step_card] FOREIGN KEY ([card_id]) REFERENCES [dbo].[card] ([id])
);








GO
CREATE NONCLUSTERED INDEX [ix_card_step_archived]
    ON [dbo].[card_step]([archived] ASC)
    INCLUDE([card_id]);


GO
CREATE NONCLUSTERED INDEX [ix_card_step]
    ON [dbo].[card_step]([card_id] ASC);

