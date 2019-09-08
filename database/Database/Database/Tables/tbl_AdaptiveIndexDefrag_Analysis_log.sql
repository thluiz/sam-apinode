CREATE TABLE [dbo].[tbl_AdaptiveIndexDefrag_Analysis_log] (
    [analysis_id]      INT            IDENTITY (1, 1) NOT NULL,
    [Operation]        NCHAR (5)      NULL,
    [dbID]             INT            NOT NULL,
    [dbName]           NVARCHAR (128) NOT NULL,
    [objectID]         INT            NOT NULL,
    [objectName]       NVARCHAR (256) NULL,
    [index_or_stat_ID] INT            NOT NULL,
    [partitionNumber]  SMALLINT       NULL,
    [dateTimeStart]    DATETIME       NOT NULL,
    [dateTimeEnd]      DATETIME       NULL,
    [durationSeconds]  INT            NULL,
    [errorMessage]     VARCHAR (1000) NULL,
    CONSTRAINT [PK_AdaptiveIndexDefrag_Analysis_log] PRIMARY KEY CLUSTERED ([analysis_id] ASC)
);


GO
CREATE NONCLUSTERED INDEX [IX_tbl_AdaptiveIndexDefrag_Analysis_log_dateTimeEnd]
    ON [dbo].[tbl_AdaptiveIndexDefrag_Analysis_log]([analysis_id] ASC, [dateTimeEnd] ASC);

