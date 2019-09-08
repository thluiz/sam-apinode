CREATE procedure GetPeopleByNameForBot(        
 @names varchar(max)        
)        
as         
begin        
 declare @n int, @query varchar(300), @total int, @search varchar(300)        
 declare @people table( person_id int,         
  [name] varchar(300),         
  [query] varchar(300),         
  [search] varchar(300),        
  total int,        
  options varchar(max),        
  found bit        
 )        
        
 declare @options table(        
  search varchar(300),        
  id int,        
  [name] varchar(300),        
  found bit        
 )        
        
 select distinct ltrim(rtrim(item)) as [query], ROW_NUMBER() over(order by item) n        
 into #names        
 from dbo.split(@names, ',')        
         
 while(exists(select 1 from #names))        
 begin        
  select top 1 @n = n, @search = [query], @query = '"' +[query] + '"' from #names        
        
  select @total = count(distinct p.id)         
  from person p        
   join person_alias pa on p.id = pa.person_id        
  where contains(pa.alias,  @query)             
        
  if(@total = 1)        
  begin        
   insert into @people(person_id, [name], [query], search, total, options, found)        
    select distinct p.id, p.[name], null, null, 1, '', 1        
    from person p        
     join person_alias pa on p.id = pa.person_id        
    where contains(pa.alias,  @query)          
  end               
  else        
  begin        
   if(exists(select 1         
    from person p        
    join person_alias pa on p.id = pa.person_id        
    where contains(pa.alias,  @query)))        
   begin        
    insert into @options(search, id, [name], found)        
     select Top 5 @search, p.id, p.[name], 1       
  from person p        
  join person_alias pa on p.id = pa.person_id        
     where contains(pa.alias,  @query)            
   end        
   else        
   begin        
    insert into @options(search, found) values (@search, 0)        
   end        
  end        
        
  delete from #names where n = @n        
 end        
        
 delete from @options where exists (select 1 from @people where person_id = id)        
        
        
 insert into @people(found, [name], total, options)        
  select distinct found, search, count(1),         
     (select distinct top 5 id person_id, [name]       
     from @options o2       
     where o1.search = o2.search      
     for json path      
     )           
  from @options o1        
  group by search, found        
        
 select distinct * from @people        
 order by [name]        
        
 drop table #names        
end        
        
  