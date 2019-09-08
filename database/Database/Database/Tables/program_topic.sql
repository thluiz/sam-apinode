CREATE TABLE [dbo].[program_topic] (
    [id]             INT            IDENTITY (1, 1) NOT NULL,
    [program_id]     INT            NOT NULL,
    [domain_id]      INT            NULL,
    [session_number] INT            NULL,
    [topic_number]   INT            NULL,
    [title]          NVARCHAR (500) NULL,
    [description]    NVARCHAR (MAX) NULL,
    [order]          INT            DEFAULT ((0)) NOT NULL,
    [archived]       BIT            DEFAULT ((0)) NOT NULL,
    PRIMARY KEY CLUSTERED ([id] ASC)
);

