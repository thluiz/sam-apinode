
------------------------------------------------------------------------------------------------------------------------------

CREATE PROCEDURE usp_AdaptiveIndexDefrag_CurrentExecStats @dbname NVARCHAR(255) = NULL
AS
/*
usp_AdaptiveIndexDefrag_CurrentExecStats.sql - pedro.lopes@microsoft.com (http://aka.ms/AID)

Allows monitoring of what has been done so far in the defrag loop.

Use @dbname to monitor a specific database

Example:
EXEC usp_AdaptiveIndexDefrag_CurrentExecStats @dbname = 'AdventureWorks2008R2'

*/
SET NOCOUNT ON;
IF @dbname IS NULL
BEGIN
	WITH cte1 ([Database_Name], Total_indexes) AS (SELECT [dbName], COUNT(indexID) AS Total_Indexes FROM dbo.tbl_AdaptiveIndexDefrag_Working GROUP BY [dbName]),
		cte2 ([Database_Name], Defraged_Indexes) AS (SELECT [dbName], COUNT(indexID) AS Total_Indexes FROM dbo.tbl_AdaptiveIndexDefrag_Working WHERE defragDate IS NOT NULL OR printStatus = 1 GROUP BY [dbName]),
		cte3 ([Database_Name], Total_statistics) AS (SELECT [dbName], COUNT(statsID) AS Total_statistics FROM dbo.tbl_AdaptiveIndexDefrag_Stats_Working GROUP BY [dbName]),
		cte4 ([Database_Name], Updated_statistics) AS (SELECT [dbName], COUNT(statsID) AS Updated_statistics FROM dbo.tbl_AdaptiveIndexDefrag_Stats_Working WHERE updateDate IS NOT NULL OR printStatus = 1 GROUP BY [dbName])
	SELECT cte1.[Database_Name], SUM(cte1.Total_indexes) AS Total_indexes, SUM(ISNULL(cte2.Defraged_Indexes, 0)) AS Defraged_Indexes,
		SUM(cte3.Total_statistics) AS Total_statistics, SUM(ISNULL(cte4.Updated_statistics, 0)) AS Updated_statistics
	FROM cte1 INNER JOIN cte3 ON cte1.Database_Name = cte3.Database_Name
	LEFT JOIN cte2 ON cte1.Database_Name = cte2.Database_Name
	LEFT JOIN cte4 ON cte1.Database_Name = cte4.Database_Name
	GROUP BY cte1.[Database_Name];

	SELECT 'Index' AS [Type], 'Done' AS [Result], dbName, objectName, indexName
	FROM dbo.tbl_AdaptiveIndexDefrag_Working
	WHERE defragDate IS NOT NULL OR printStatus = 1
	UNION ALL
	SELECT 'Index' AS [Type], 'To do' AS [Result], dbName, objectName, indexName
	FROM dbo.tbl_AdaptiveIndexDefrag_Working
	WHERE defragDate IS NULL AND printStatus = 0
	ORDER BY 2, dbName, objectName, indexName;

	SELECT 'Statistic' AS [Type], 'Done' AS [Result], dbName, objectName, statsName
	FROM dbo.tbl_AdaptiveIndexDefrag_Stats_Working
	WHERE updateDate IS NOT NULL OR printStatus = 1
	UNION ALL
	SELECT 'Statistic' AS [Type], 'To do' AS [Result], dbName, objectName, statsName
	FROM dbo.tbl_AdaptiveIndexDefrag_Stats_Working
	WHERE updateDate IS NULL AND printStatus = 0
	ORDER BY 2, dbName, objectName, statsName;
END
ELSE
BEGIN
	WITH cte1 ([Database_Name], Total_indexes) AS (SELECT [dbName], COUNT(indexID) AS Total_Indexes FROM dbo.tbl_AdaptiveIndexDefrag_Working WHERE [dbName] = QUOTENAME(@dbname) GROUP BY [dbName]),
		cte2 ([Database_Name], Defraged_Indexes) AS (SELECT [dbName], COUNT(indexID) AS Total_Indexes FROM dbo.tbl_AdaptiveIndexDefrag_Working WHERE [dbName] = QUOTENAME(@dbname) AND defragDate IS NOT NULL OR printStatus = 1 GROUP BY [dbName]),
		cte3 ([Database_Name], Total_statistics) AS (SELECT [dbName], COUNT(statsID) AS Total_statistics FROM dbo.tbl_AdaptiveIndexDefrag_Stats_Working WHERE [dbName] = QUOTENAME(@dbname) GROUP BY [dbName]),
		cte4 ([Database_Name], Updated_statistics) AS (SELECT [dbName], COUNT(statsID) AS Updated_statistics FROM dbo.tbl_AdaptiveIndexDefrag_Stats_Working WHERE [dbName] = QUOTENAME(@dbname) AND updateDate IS NOT NULL OR printStatus = 1 GROUP BY [dbName])
	SELECT cte1.[Database_Name], SUM(cte1.Total_indexes) AS Total_indexes, SUM(ISNULL(cte2.Defraged_Indexes, 0)) AS Defraged_Indexes,
		SUM(cte3.Total_statistics) AS Total_statistics, SUM(ISNULL(cte4.Updated_statistics, 0)) AS Updated_statistics
	FROM cte1 INNER JOIN cte3 ON cte1.Database_Name = cte3.Database_Name
	LEFT JOIN cte2 ON cte1.Database_Name = cte2.Database_Name
	LEFT JOIN cte4 ON cte1.Database_Name = cte4.Database_Name
	GROUP BY cte1.[Database_Name];

	SELECT 'Index' AS [Type], 'Done' AS [Result], dbName, objectName, indexName, partitionNumber
	FROM dbo.tbl_AdaptiveIndexDefrag_Working
	WHERE [dbName] = QUOTENAME(@dbname) AND (defragDate IS NOT NULL OR printStatus = 1)
	UNION ALL
	SELECT 'Index' AS [Type], 'To do' AS [Result], dbName, objectName, indexName, partitionNumber
	FROM dbo.tbl_AdaptiveIndexDefrag_Working
	WHERE [dbName] = QUOTENAME(@dbname) AND defragDate IS NULL AND printStatus = 0
	ORDER BY 2, dbName, objectName, indexName;

	SELECT 'Statistic' AS [Type], 'Done' AS [Result], dbName, objectName, statsName
	FROM dbo.tbl_AdaptiveIndexDefrag_Stats_Working
	WHERE [dbName] = QUOTENAME(@dbname) AND ([updateDate] IS NOT NULL OR printStatus = 1)
	UNION ALL
	SELECT 'Statistic' AS [Type], 'To do' AS [Result], dbName, objectName, statsName
	FROM dbo.tbl_AdaptiveIndexDefrag_Stats_Working
	WHERE [dbName] = QUOTENAME(@dbname) AND [updateDate] IS NULL AND printStatus = 0
	ORDER BY 2, dbName, objectName, statsName;
END