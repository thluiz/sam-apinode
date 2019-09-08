    CREATE procedure GenerateFailMessage(@message nvarchar(max), @code int = 0)
    as
    begin
        select cast(0 as bit) success, @message message, @code errorCode
        for json path
    end