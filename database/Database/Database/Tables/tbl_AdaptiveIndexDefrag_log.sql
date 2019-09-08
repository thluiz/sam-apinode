CREATE TABLE [dbo].[tbl_AdaptiveIndexDefrag_log] (
    [indexDefrag_id]   INT            IDENTITY (1, 1) NOT NULL,
    [dbID]             INT            NOT NULL,
    [dbName]           NVARCHAR (128) NOT NULL,
    [objectID]         INT            NOT NULL,
    [objectName]       NVARCHAR (256) NULL,
    [indexID]          INT            NOT NULL,
    [indexName]        NVARCHAR (256) NULL,
    [partitionNumber]  SMALLINT       NULL,
    [fragmentation]    FLOAT (53)     NOT NULL,
    [page_count]       BIGINT         NOT NULL,
    [range_scan_count] BIGINT         NULL,
    [fill_factor]      INT            NULL,
    [dateTimeStart]    DATETIME       NOT NULL,
    [dateTimeEnd]      DATETIME       NULL,
    [durationSeconds]  INT            NULL,
    [sqlStatement]     VARCHAR (4000) NULL,
    [errorMessage]     VARCHAR (1000) NULL,
    CONSTRAINT [PK_AdaptiveIndexDefrag_log] PRIMARY KEY CLUSTERED ([indexDefrag_id] ASC)
);


GO
CREATE NONCLUSTERED INDEX [IX_tbl_AdaptiveIndexDefrag_log_dateTimeEnd]
    ON [dbo].[tbl_AdaptiveIndexDefrag_log]([indexDefrag_id] ASC, [dateTimeEnd] ASC);


GO
CREATE NONCLUSTERED INDEX [IX_tbl_AdaptiveIndexDefrag_log]
    ON [dbo].[tbl_AdaptiveIndexDefrag_log]([dbID] ASC, [objectID] ASC, [indexName] ASC, [dateTimeEnd] ASC);

