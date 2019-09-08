
CREATE VIEW vw_AvgSamplingLst30Days
AS
SELECT TOP 100 PERCENT 'Avg_Sampling' AS Comment, dbName, objectName, partitionNumber, statsName, CAST((rows_sampled/([rows]*1.00))*100.0 AS DECIMAL(5,2)) AS sampling, dateTimeStart, dateTimeEnd, sqlStatement, errorMessage		
FROM dbo.tbl_AdaptiveIndexDefrag_Stats_log
WHERE errorMessage IS NOT NULL AND dateTimeStart >= DATEADD(dd, DATEDIFF(dd, 0, getUTCdate()), -30)
ORDER BY dateTimeStart;