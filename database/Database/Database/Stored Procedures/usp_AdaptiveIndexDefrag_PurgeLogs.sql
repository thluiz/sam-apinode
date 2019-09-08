
------------------------------------------------------------------------------------------------------------------------------		

CREATE PROCEDURE usp_AdaptiveIndexDefrag_PurgeLogs @daystokeep smallint = 90
AS
/*
usp_AdaptiveIndexDefrag_PurgeLogs.sql - pedro.lopes@microsoft.com (http://aka.ms/AID)

Purge log tables to avoid indefinite growth.
Default is data older than 90 days.
Change @daystokeep as you deem fit.

*/
SET NOCOUNT ON;
SET DATEFORMAT ymd;

DELETE FROM dbo.tbl_AdaptiveIndexDefrag_log
WHERE dateTimeStart <= DATEADD(dd, DATEDIFF(dd, 0, getUTCdate()), -@daystokeep);
DELETE FROM dbo.tbl_AdaptiveIndexDefrag_Stats_log
WHERE dateTimeStart <= DATEADD(dd, DATEDIFF(dd, 0, getUTCdate()), -@daystokeep);