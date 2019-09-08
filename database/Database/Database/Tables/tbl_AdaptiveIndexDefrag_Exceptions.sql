CREATE TABLE [dbo].[tbl_AdaptiveIndexDefrag_Exceptions] (
    [dbID]          INT            NOT NULL,
    [objectID]      INT            NOT NULL,
    [indexID]       INT            NOT NULL,
    [dbName]        NVARCHAR (128) NOT NULL,
    [objectName]    NVARCHAR (256) NOT NULL,
    [indexName]     NVARCHAR (256) NOT NULL,
    [exclusionMask] INT            NOT NULL,
    CONSTRAINT [PK_AdaptiveIndexDefrag_Exceptions] PRIMARY KEY CLUSTERED ([dbID] ASC, [objectID] ASC, [indexID] ASC)
);

