CREATE TABLE [dbo].[personal_inventory] (
    [id]                INT            IDENTITY (1, 1) NOT NULL,
    [person_id]         INT            NOT NULL,
    [inventory_item_id] INT            NOT NULL,
    [request_date]      DATETIME       NULL,
    [requested_by]      INT            NULL,
    [acknowledge_date]  DATETIME       NULL,
    [acknowledge_by]    INT            NULL,
    [delivery_date]     DATETIME       NULL,
    [delivered_by]      INT            NULL,
    [expiration_date]   DATETIME       NULL,
    [title]             NVARCHAR (300) NULL,
    [description]       NVARCHAR (MAX) NULL,
    [gender]            VARCHAR (1)    NULL,
    [size]              VARCHAR (3)    NULL,
    PRIMARY KEY CLUSTERED ([id] ASC)
);

