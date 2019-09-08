CREATE TABLE [dbo].[branch_product] (
    [id]                        INT             IDENTITY (1, 1) NOT NULL,
    [name]                      VARCHAR (150)   NULL,
    [product_id]                INT             NULL,
    [branch_id]                 INT             NOT NULL,
    [base_value]                DECIMAL (12, 2) NULL,
    [association_percentage]    DECIMAL (12, 2) NULL,
    [im_percentage]             DECIMAL (12, 2) NULL,
    [local_percentage]          DECIMAL (12, 2) NULL,
    [association_minimal_value] DECIMAL (12, 2) NULL,
    [im_minimal_value]          DECIMAL (12, 2) NULL,
    [local_minimal_value]       DECIMAL (12, 2) NULL,
    [category_id]               INT             NOT NULL,
    [currency_id]               INT             DEFAULT ((1)) NOT NULL,
    [archived]                  BIT             DEFAULT ((0)) NOT NULL,
    PRIMARY KEY CLUSTERED ([id] ASC)
);



