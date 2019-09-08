
CREATE VIEW vw_AvgTimeLst30Days
AS
SELECT TOP 100 PERCENT 'Longest time' AS Comment, dbName, objectName, indexName, partitionNumber, AVG(durationSeconds) AS Avg_durationSeconds		
FROM dbo.tbl_AdaptiveIndexDefrag_log
WHERE dateTimeStart >= DATEADD(dd, DATEDIFF(dd, 0, getUTCdate()), -30)
GROUP BY dbName, objectName, indexName, partitionNumber
ORDER BY AVG(durationSeconds) DESC, dbName, objectName, indexName, partitionNumber;