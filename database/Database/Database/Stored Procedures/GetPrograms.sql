create procedure GetPrograms
as
begin

 select id, long_name [name], (select id, long_name [name]        
    from domain do         
    where do.program_id = ppg.id        
    order by [order] desc        
    for json path) [domains]         
 from program ppg        
 for json path

end