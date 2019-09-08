
CREATE VIEW vw_LastRun_Log
AS
SELECT TOP 100 percent [dbName]
      ,[objectName]
      ,[indexName]
      , NULL AS [statsName]
      ,[partitionNumber]
      ,[fragmentation]
	  ,[page_count]
	  ,[range_scan_count]
      ,[dateTimeStart]
      ,[dateTimeEnd]
      ,[durationSeconds]
      ,CASE WHEN [sqlStatement] LIKE '%REORGANIZE%' THEN 'Reorg' ELSE 'Rebuild' END AS [Operation]
      ,[errorMessage]
FROM dbo.tbl_AdaptiveIndexDefrag_log ixlog
CROSS APPLY (SELECT TOP 1 minIxDate = CASE WHEN defragDate IS NULL THEN CONVERT(DATETIME, CONVERT(NVARCHAR, scanDate, 112))
	ELSE CONVERT(DATETIME, CONVERT(NVARCHAR, defragDate, 112)) END
	FROM [dbo].[tbl_AdaptiveIndexDefrag_Working]
	ORDER BY defragDate ASC, scanDate ASC) AS minDateIxCte
WHERE dateTimeStart >= minIxDate
UNION ALL
SELECT TOP 100 percent [dbName]
      ,[objectName]
      ,NULL AS [indexName]
      ,[statsName]
      ,NULL AS [partitionNumber]
      ,NULL AS [fragmentation]
	  ,NULL AS [page_count]
	  ,NULL AS [range_scan_count]
      ,[dateTimeStart]
      ,[dateTimeEnd]
      ,[durationSeconds]
      ,'UpdateStats' AS [Operation]
      ,[errorMessage]
FROM dbo.tbl_AdaptiveIndexDefrag_Stats_log statlog
CROSS APPLY (SELECT TOP 1 minStatDate = CASE WHEN updateDate IS NULL THEN CONVERT(DATETIME, CONVERT(NVARCHAR, scanDate, 112))
		ELSE CONVERT(DATETIME, CONVERT(NVARCHAR, updateDate, 112)) END
		FROM [dbo].[tbl_AdaptiveIndexDefrag_Stats_Working]
	ORDER BY updateDate ASC, scanDate ASC) AS minDateStatCte
WHERE dateTimeStart >= minStatDate
ORDER BY dateTimeEnd ASC