CREATE TABLE [dbo].[card_template_step] (
    [id]               INT           IDENTITY (1, 1) NOT NULL,
    [card_template_id] INT           NOT NULL,
    [name]             VARCHAR (100) NULL,
    [order]            INT           DEFAULT ((0)) NULL,
    [need_due_date]    BIT           DEFAULT ((0)) NOT NULL,
    [need_action]      BIT           DEFAULT ((0)) NOT NULL,
    [is_blocking_step] BIT           DEFAULT ((0)) NOT NULL,
    [is_closing_step]  BIT           DEFAULT ((0)) NOT NULL,
    PRIMARY KEY CLUSTERED ([id] ASC)
);

