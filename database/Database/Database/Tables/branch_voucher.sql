CREATE TABLE [dbo].[branch_voucher] (
    [id]         INT IDENTITY (1, 1) NOT NULL,
    [branch_id]  INT NOT NULL,
    [voucher_id] INT NOT NULL,
    PRIMARY KEY CLUSTERED ([id] ASC)
);

