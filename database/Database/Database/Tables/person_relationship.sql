CREATE TABLE [dbo].[person_relationship] (
    [id]                         INT              IDENTITY (1, 1) NOT NULL,
    [person_id]                  INT              NOT NULL,
    [person2_id]                 INT              NOT NULL,
    [relationship_type]          INT              NOT NULL,
    [identifier]                 UNIQUEIDENTIFIER DEFAULT (newid()) NOT NULL,
    [first_voucher_sended_date]  DATETIME         NULL,
    [second_voucher_sended_date] DATETIME         NULL,
    [monitoring_card_id]         INT              NULL,
    PRIMARY KEY CLUSTERED ([id] ASC),
    CONSTRAINT [fk_person_relationship_card] FOREIGN KEY ([monitoring_card_id]) REFERENCES [dbo].[card] ([id]),
    CONSTRAINT [fk_person_relationship_person1] FOREIGN KEY ([person_id]) REFERENCES [dbo].[person] ([id]),
    CONSTRAINT [fk_person_relationship_person2] FOREIGN KEY ([person2_id]) REFERENCES [dbo].[person] ([id])
);





