CREATE TABLE [dbo].[voucher] (
    [id]                    INT            IDENTITY (1, 1) NOT NULL,
    [title]                 VARCHAR (300)  NOT NULL,
    [url]                   VARCHAR (100)  NOT NULL,
    [header_text]           VARCHAR (MAX)  NULL,
    [initials]              VARCHAR (3)    NULL,
    [active]                BIT            DEFAULT ((1)) NOT NULL,
    [additional_question]   VARCHAR (200)  NULL,
    [final_text]            NVARCHAR (MAX) NULL,
    [confirm_button_text]   VARCHAR (40)   NULL,
    [header_title]          VARCHAR (35)   NULL,
    [anonymous_header_text] NVARCHAR (MAX) NULL,
    [youtube_url]           VARCHAR (300)  NULL,
    [voucher_type]          INT            DEFAULT ((1)) NOT NULL,
    [order]                 INT            DEFAULT ((0)) NOT NULL,
    PRIMARY KEY CLUSTERED ([id] ASC),
    CONSTRAINT [fk_voucher_voucher_type] FOREIGN KEY ([voucher_type]) REFERENCES [dbo].[enum_voucher_type] ([id])
);











