CREATE TABLE [dbo].[enum_activity_type] (
    [id]          INT           IDENTITY (1, 1) NOT NULL,
    [name]        VARCHAR (150) NULL,
    [order]       INT           DEFAULT ((50)) NOT NULL,
    [close_group] BIT           DEFAULT ((0)) NOT NULL,
    [obrigatory]  BIT           DEFAULT ((0)) NOT NULL,
    [active]      BIT           DEFAULT ((1)) NOT NULL,
    PRIMARY KEY CLUSTERED ([id] ASC)
);



