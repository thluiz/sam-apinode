CREATE TABLE [dbo].[tbl_AdaptiveIndexDefrag_IxDisableStatus] (
    [disable_id]     INT      IDENTITY (1, 1) NOT NULL,
    [dbID]           INT      NOT NULL,
    [objectID]       INT      NOT NULL,
    [indexID]        INT      NOT NULL,
    [is_disabled]    BIT      NULL,
    [dateTimeChange] DATETIME NOT NULL,
    CONSTRAINT [PK_AdaptiveIndexDefrag_IxDisableStatus] PRIMARY KEY CLUSTERED ([disable_id] ASC)
);

