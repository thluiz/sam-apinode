
CREATE VIEW vw_AvgFragLst30Days
AS
SELECT TOP 100 PERCENT 'Most fragmented' AS Comment, dbName, objectName, indexName, partitionNumber, CONVERT(decimal(9,2),AVG(fragmentation)) AS Avg_fragmentation
FROM dbo.tbl_AdaptiveIndexDefrag_Working
WHERE defragDate >= DATEADD(dd, DATEDIFF(dd, 0, getUTCdate()), -30)
GROUP BY dbName, objectName, indexName, partitionNumber
ORDER BY AVG(fragmentation) DESC, dbName, objectName, indexName, partitionNumber;