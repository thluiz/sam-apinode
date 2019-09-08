CREATE TABLE [dbo].[card_template] (
    [id]                      INT           IDENTITY (1, 1) NOT NULL,
    [name]                    VARCHAR (250) NULL,
    [automatically_generated] BIT           DEFAULT ((0)) NOT NULL,
    [active]                  BIT           DEFAULT ((1)) NOT NULL,
    [order]                   INT           DEFAULT ((0)) NOT NULL,
    [is_task]                 BIT           DEFAULT ((0)) NOT NULL,
    [require_target]          BIT           DEFAULT ((0)) NOT NULL,
    [require_target_group]    BIT           DEFAULT ((0)) NOT NULL,
    PRIMARY KEY CLUSTERED ([id] ASC)
);



