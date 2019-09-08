CREATE TABLE [dbo].[address] (
    [id]          INT           IDENTITY (1, 1) NOT NULL,
    [country_id]  INT           NOT NULL,
    [postal_code] VARCHAR (30)  NOT NULL,
    [street]      VARCHAR (200) NOT NULL,
    [district]    VARCHAR (100) NULL,
    [city]        VARCHAR (100) NOT NULL,
    [state]       VARCHAR (100) NOT NULL,
    [number]      VARCHAR (30)  NULL,
    [complement]  VARCHAR (50)  NULL,
    [archived]    BIT           DEFAULT ((0)) NOT NULL,
    PRIMARY KEY CLUSTERED ([id] ASC),
    CONSTRAINT [fk_country_address] FOREIGN KEY ([country_id]) REFERENCES [dbo].[country] ([id])
);

