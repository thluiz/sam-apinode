CREATE TABLE [dbo].[person_card] (
    [id]                   INT           IDENTITY (1, 1) NOT NULL,
    [person_id]            INT           NOT NULL,
    [card_id]              INT           NOT NULL,
    [position]             INT           NOT NULL,
    [position_description] VARCHAR (100) NULL,
    [order]                INT           DEFAULT ((0)) NOT NULL,
    PRIMARY KEY CLUSTERED ([id] ASC)
);




GO
CREATE NONCLUSTERED INDEX [ix_person_card_card]
    ON [dbo].[person_card]([card_id] ASC);

