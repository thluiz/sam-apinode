CREATE TABLE [dbo].[person_voucher] (
    [id]                INT            IDENTITY (1, 1) NOT NULL,
    [person_id]         INT            NOT NULL,
    [voucher_id]        INT            NOT NULL,
    [branch_map_id]     INT            NOT NULL,
    [date_created]      DATETIME       DEFAULT (getUTCdate()) NOT NULL,
    [additional_answer] NVARCHAR (MAX) NULL,
    [person2_id]        INT            NULL,
    PRIMARY KEY CLUSTERED ([id] ASC),
    CONSTRAINT [fk_person_voucher] FOREIGN KEY ([person_id]) REFERENCES [dbo].[person] ([id]),
    CONSTRAINT [fk_person_voucher_person2] FOREIGN KEY ([person2_id]) REFERENCES [dbo].[person] ([id])
);




GO
CREATE NONCLUSTERED INDEX [idx_person_voucher_person_id]
    ON [dbo].[person_voucher]([person_id] ASC);

