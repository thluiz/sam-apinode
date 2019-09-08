CREATE TABLE [dbo].[tbl_AdaptiveIndexDefrag_Stats_Working] (
    [dbID]            INT            NOT NULL,
    [objectID]        INT            NOT NULL,
    [statsID]         INT            NOT NULL,
    [partitionNumber] SMALLINT       NOT NULL,
    [dbName]          NVARCHAR (128) NULL,
    [schemaName]      NVARCHAR (128) NULL,
    [objectName]      NVARCHAR (256) NULL,
    [statsName]       NVARCHAR (256) NULL,
    [no_recompute]    BIT            NULL,
    [is_incremental]  BIT            NULL,
    [scanDate]        DATETIME       NULL,
    [updateDate]      DATETIME       NULL,
    [printStatus]     BIT            DEFAULT ((0)) NULL,
    CONSTRAINT [PK_AdaptiveIndexDefrag_Stats_Working] PRIMARY KEY CLUSTERED ([dbID] ASC, [objectID] ASC, [statsID] ASC, [partitionNumber] ASC)
);

