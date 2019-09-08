CREATE TABLE [dbo].[enum_incident_type] (
    [id]                           INT           IDENTITY (1, 1) NOT NULL,
    [name]                         VARCHAR (150) NULL,
    [abrev]                        VARCHAR (10)  NULL,
    [parent_id]                    INT           NULL,
    [need_description]             BIT           DEFAULT ((0)) NOT NULL,
    [obrigatory]                   BIT           DEFAULT ((0)) NOT NULL,
    [need_value]                   BIT           DEFAULT ((0)) NOT NULL,
    [active]                       BIT           DEFAULT ((1)) NOT NULL,
    [order]                        INT           DEFAULT ((0)) NOT NULL,
    [need_description_for_closing] BIT           DEFAULT ((0)) NOT NULL,
    [activity_type]                INT           NULL,
    [show_hour_in_diary]           BIT           DEFAULT ((0)) NOT NULL,
    [automatically_generated]      BIT           DEFAULT ((0)) NOT NULL,
    [need_start_hour_minute]       BIT           DEFAULT ((0)) NOT NULL,
    [need_to_be_started]           BIT           DEFAULT ((0)) NOT NULL,
    [allowed_for_new_person]       BIT           DEFAULT ((0)) NOT NULL,
    [financial_type]               INT           DEFAULT ((0)) NOT NULL,
    [use_in_map]                   BIT           DEFAULT ((0)) NOT NULL,
    [require_title]                BIT           DEFAULT ((0)) NOT NULL,
    [require_payment_method]       BIT           DEFAULT ((0)) NOT NULL,
    [require_contact_method]       BIT           DEFAULT ((0)) NOT NULL,
    [need_fund_value]              BIT           DEFAULT ((0)) NOT NULL,
    [require_ownership]            BIT           DEFAULT ((0)) NOT NULL,
    [can_have_actions]             BIT           DEFAULT ((0)) NOT NULL,
    PRIMARY KEY CLUSTERED ([id] ASC)
);













