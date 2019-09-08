CREATE TABLE [dbo].[enum_person_schedule_type] (
    [id]                      INT           NOT NULL,
    [description]             VARCHAR (100) NULL,
    [need_description]        BIT           DEFAULT ((0)) NOT NULL,
    [active]                  BIT           DEFAULT ((1)) NOT NULL,
    [abrev]                   VARCHAR (15)  NULL,
    [automatically_generated] BIT           DEFAULT ((0)) NOT NULL,
    [need_value]              BIT           DEFAULT ((0)) NOT NULL,
    [incident_type]           INT           NULL,
    PRIMARY KEY CLUSTERED ([id] ASC)
);

