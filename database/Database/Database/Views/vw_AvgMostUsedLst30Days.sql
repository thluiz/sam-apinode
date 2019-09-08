
CREATE VIEW vw_AvgMostUsedLst30Days
AS
SELECT TOP 100 PERCENT 'Most used' AS Comment, dbName, objectName, indexName, partitionNumber, AVG(range_scan_count) AS Avg_range_scan_count	
FROM dbo.tbl_AdaptiveIndexDefrag_Working
WHERE defragDate >= DATEADD(dd, DATEDIFF(dd, 0, getUTCdate()), -30)
GROUP BY dbName, objectName, indexName, partitionNumber
ORDER BY AVG(range_scan_count) DESC;