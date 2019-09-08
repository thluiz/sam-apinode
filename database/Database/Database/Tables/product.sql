CREATE TABLE [dbo].[product] (
    [id]                        INT             IDENTITY (1, 1) NOT NULL,
    [name]                      VARCHAR (100)   NOT NULL,
    [country_id]                INT             NOT NULL,
    [base_value]                DECIMAL (12, 2) NOT NULL,
    [association_percentage]    DECIMAL (12, 2) NOT NULL,
    [im_percentage]             DECIMAL (12, 2) NOT NULL,
    [local_percentage]          DECIMAL (12, 2) NOT NULL,
    [association_minimal_value] DECIMAL (12, 2) NOT NULL,
    [im_minimal_value]          DECIMAL (12, 2) NOT NULL,
    [local_minimal_value]       DECIMAL (12, 2) NOT NULL,
    PRIMARY KEY CLUSTERED ([id] ASC)
);

