CREATE TABLE [dbo].[branch_map] (
    [id]               INT            IDENTITY (1, 1) NOT NULL,
    [branch_id]        INT            NOT NULL,
    [title]            VARCHAR (200)  NULL,
    [receive_voucher]  BIT            DEFAULT ((0)) NOT NULL,
    [active]           BIT            DEFAULT ((1)) NOT NULL,
    [incident_type]    INT            DEFAULT ((10)) NOT NULL,
    [start_hour]       INT            NOT NULL,
    [start_minute]     INT            NOT NULL,
    [end_hour]         INT            NOT NULL,
    [end_minute]       INT            NOT NULL,
    [base_description] NVARCHAR (MAX) NULL,
    PRIMARY KEY CLUSTERED ([id] ASC),
    CONSTRAINT [fk_branch_map_branch] FOREIGN KEY ([branch_id]) REFERENCES [dbo].[branch] ([id]),
    CONSTRAINT [fk_branch_map_incident_type] FOREIGN KEY ([incident_type]) REFERENCES [dbo].[enum_incident_type] ([id])
);

