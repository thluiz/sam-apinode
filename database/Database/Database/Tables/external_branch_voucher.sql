CREATE TABLE [dbo].[external_branch_voucher] (
    [id]                 INT IDENTITY (1, 1) NOT NULL,
    [external_branch_id] INT NULL,
    [voucher_id]         INT NULL,
    PRIMARY KEY CLUSTERED ([id] ASC)
);

