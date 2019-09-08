CREATE TABLE [dbo].[person_card_position] (
    [id]           INT           IDENTITY (1, 1) NOT NULL,
    [name]         VARCHAR (100) NULL,
    [hierarchical] BIT           DEFAULT ((0)) NOT NULL,
    [active]       BIT           DEFAULT ((0)) NOT NULL,
    PRIMARY KEY CLUSTERED ([id] ASC)
);

