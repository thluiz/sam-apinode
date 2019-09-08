CREATE TABLE [dbo].[enum_relationship_type] (
    [id]                  INT           IDENTITY (1, 1) NOT NULL,
    [name]                VARCHAR (50)  NULL,
    [masculine_treatment] VARCHAR (150) NULL,
    [feminine_treatment]  VARCHAR (150) NULL,
    [active]              BIT           DEFAULT ((1)) NOT NULL,
    PRIMARY KEY CLUSTERED ([id] ASC)
);





