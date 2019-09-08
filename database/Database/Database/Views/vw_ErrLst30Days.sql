
------------------------------------------------------------------------------------------------------------------------------		

CREATE VIEW vw_ErrLst30Days
AS
SELECT TOP 100 PERCENT dbName, objectName, indexName, partitionNumber, NULL AS statsName, dateTimeStart, dateTimeEnd, sqlStatement, errorMessage		
FROM dbo.tbl_AdaptiveIndexDefrag_log
WHERE errorMessage IS NOT NULL AND dateTimeStart >= DATEADD(dd, DATEDIFF(dd, 0, getUTCdate()), -30)
UNION ALL
SELECT TOP 100 PERCENT dbName, objectName, NULL AS indexName, NULL AS partitionNumber, statsName, dateTimeStart, dateTimeEnd, sqlStatement, errorMessage		
FROM dbo.tbl_AdaptiveIndexDefrag_Stats_log
WHERE errorMessage IS NOT NULL AND dateTimeStart >= DATEADD(dd, DATEDIFF(dd, 0, getUTCdate()), -30)
ORDER BY dateTimeStart;