CREATE TABLE [dbo].[person_address] (
    [id]          INT            IDENTITY (1, 1) NOT NULL,
    [person_id]   INT            NOT NULL,
    [address_id]  INT            NOT NULL,
    [principal]   BIT            DEFAULT ((0)) NOT NULL,
    [description] NVARCHAR (MAX) NULL,
    [name]        VARCHAR (100)  NULL,
    [archived]    BIT            DEFAULT ((0)) NOT NULL,
    PRIMARY KEY CLUSTERED ([id] ASC)
);

