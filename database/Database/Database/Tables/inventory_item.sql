CREATE TABLE [dbo].[inventory_item] (
    [id]                         INT            IDENTITY (1, 1) NOT NULL,
    [name]                       NVARCHAR (200) NULL,
    [expiration_in_days]         INT            DEFAULT ((0)) NOT NULL,
    [required_for_active_member] BIT            DEFAULT ((0)) NOT NULL,
    [required_for_disciple]      BIT            DEFAULT ((0)) NOT NULL,
    [required_for_operator]      BIT            DEFAULT ((0)) NOT NULL,
    [require_title]              BIT            DEFAULT ((0)) NOT NULL,
    [required_for_program]       BIT            DEFAULT ((0)) NOT NULL,
    [require_size]               BIT            DEFAULT ((0)) NOT NULL,
    [require_gender]             BIT            DEFAULT ((0)) NOT NULL,
    PRIMARY KEY CLUSTERED ([id] ASC)
);

