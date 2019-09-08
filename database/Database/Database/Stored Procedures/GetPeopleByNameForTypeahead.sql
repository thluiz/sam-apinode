        
CREATE procedure [dbo].[GetPeopleByNameForTypeahead](                
 @names varchar(max)                
)                
as                 
begin                
 declare @n int, @query varchar(300), @total int, @search varchar(300)                
 declare @people table( person_id int,                 
  [name] varchar(300),                    
  [search] varchar(300),                   
  found bit,        
  avatar_img varchar(300),    
  is_director bit not null default 0,   
  is_disciple bit not null default 0,  
  is_active_member bit not null default 0,  
  is_interested bit not null default 0,
  avatar_md bit default 0,
  avatar_sm bit default 0,
  avatar_esm bit default 0            
 )          
                
 select distinct ltrim(rtrim(item)) as [query], ROW_NUMBER() over(order by item) n                
 into #names                
 from dbo.split(@names, ',')                
                 
 while(exists(select 1 from #names))                
 begin                
  select top 1 @n = n, @search = [query], @query = '"' +[query] + '"' from #names                
                
  select @total = count(distinct p.id)                 
  from person p                
   left join person_alias pa on p.id = pa.person_id                
  where pa.alias like '%' + @search + '%' COLLATE Latin1_General_CI_AI                  
  or p.[name] like '%' + @search + '%' COLLATE Latin1_General_CI_AI                   
                
  if(@total >= 1)                
  begin                
 insert into @people(person_id, [name], search, found, avatar_img, is_disciple, is_active_member, is_director, avatar_esm, avatar_sm, avatar_md)                
   select distinct p.id, p.[name], @search, 1, avatar_img, p.is_disciple, p.is_active_member, p.is_director, p.avatar_esm, p.avatar_sm, p.avatar_md              
   from person p                
    left join person_alias pa on p.id = pa.person_id                
   where pa.alias like '%' + @search + '%' COLLATE Latin1_General_CI_AI                         
  or p.[name] like '%' + @search + '%' COLLATE Latin1_General_CI_AI      
     
  end                               
  else                
  begin                   
  insert into @people(person_id, [name], search, found)                
  values (        
   0, @search, @search, 0        
  )        
  end                  
                
  delete from #names where n = @n                
 end                
                
 select distinct *   
 from @people p             
 order by p.is_director desc, p.is_disciple desc, p.is_active_member desc, p.[name]            
 for json path         
                
 drop table #names                
end 