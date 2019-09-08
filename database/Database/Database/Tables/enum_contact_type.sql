CREATE TABLE [dbo].[enum_contact_type] (
    [id]          INT           NOT NULL,
    [description] VARCHAR (100) NULL,
    [icon]        VARCHAR (30)  NULL,
    [placeholder] VARCHAR (100) NULL,
    [helper_text] VARCHAR (MAX) NULL,
    [base_url]    VARCHAR (100) NULL,
    PRIMARY KEY CLUSTERED ([id] ASC)
);

