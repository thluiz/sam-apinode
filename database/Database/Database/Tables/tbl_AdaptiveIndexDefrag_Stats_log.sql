CREATE TABLE [dbo].[tbl_AdaptiveIndexDefrag_Stats_log] (
    [statsUpdate_id]       INT            IDENTITY (1, 1) NOT NULL,
    [dbID]                 INT            NOT NULL,
    [dbName]               NVARCHAR (128) NULL,
    [objectID]             INT            NULL,
    [objectName]           NVARCHAR (256) NULL,
    [statsID]              INT            NOT NULL,
    [statsName]            NVARCHAR (256) NULL,
    [partitionNumber]      SMALLINT       NULL,
    [rows]                 BIGINT         NULL,
    [rows_sampled]         BIGINT         NULL,
    [modification_counter] BIGINT         NULL,
    [no_recompute]         BIT            NULL,
    [dateTimeStart]        DATETIME       NOT NULL,
    [dateTimeEnd]          DATETIME       NULL,
    [durationSeconds]      INT            NULL,
    [sqlStatement]         VARCHAR (4000) NULL,
    [errorMessage]         VARCHAR (1000) NULL,
    CONSTRAINT [PK_AdaptiveIndexDefrag_Stats_log] PRIMARY KEY CLUSTERED ([statsUpdate_id] ASC)
);


GO
CREATE NONCLUSTERED INDEX [IX_tbl_AdaptiveIndexDefrag_Stats_log]
    ON [dbo].[tbl_AdaptiveIndexDefrag_Stats_log]([dbID] ASC, [objectID] ASC, [statsName] ASC, [dateTimeEnd] ASC) WITH (FILLFACTOR = 100);

