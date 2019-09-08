CREATE TABLE [dbo].[branch] (
    [id]                  INT            IDENTITY (1, 1) NOT NULL,
    [name]                VARCHAR (100)  NULL,
    [active]              BIT            DEFAULT ((1)) NOT NULL,
    [abrev]               VARCHAR (100)  NULL,
    [initials]            VARCHAR (3)    NULL,
    [location_id]         INT            NOT NULL,
    [has_voucher]         BIT            DEFAULT ((1)) NOT NULL,
    [category_id]         INT            DEFAULT ((1)) NOT NULL,
    [order]               INT            DEFAULT ((0)) NOT NULL,
    [contact_phone]       NVARCHAR (200) NULL,
    [contact_email]       NVARCHAR (200) NULL,
    [default_currency_id] INT            NULL,
    [timezone_id]         INT            DEFAULT ((1)) NOT NULL,
    PRIMARY KEY CLUSTERED ([id] ASC),
    CONSTRAINT [fk_branch_timezone] FOREIGN KEY ([timezone_id]) REFERENCES [dbo].[timezone] ([id])
);











