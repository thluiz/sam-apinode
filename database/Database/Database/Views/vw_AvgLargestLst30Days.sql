
CREATE VIEW vw_AvgLargestLst30Days
AS
SELECT TOP 100 PERCENT 'Largest' AS Comment, dbName, objectName, indexName, partitionNumber, AVG(page_count)*8 AS Avg_size_KB, fill_factor		
FROM dbo.tbl_AdaptiveIndexDefrag_Working
WHERE defragDate >= DATEADD(dd, DATEDIFF(dd, 0, getUTCdate()), -30)
GROUP BY dbName, objectName, indexName, partitionNumber, fill_factor
ORDER BY AVG(page_count) DESC, dbName, objectName, indexName, partitionNumber