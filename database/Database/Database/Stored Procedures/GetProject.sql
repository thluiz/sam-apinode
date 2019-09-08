CREATE procedure [dbo].[GetProject](@project_id int, @user int = null)                    
as                    
begin                    
                                	
select *,    
	cast(case when     
		 exists(select 1 from [card] (nolock) parent where parent.id = c.parent_id and parent.parent_id is null )     
		 then     
		  0    
		 else 1 end as bit)  is_subproject,
	(select *    	
	   from dbo.vwCard (nolock)              
	   where parent_id = @project_id            
	   and cancelled = 0      
	   and archived = 0              
	   order by [order]           
	   for json path) childrens
 from [vwCard] c (nolock)                    
 where        
	c.id = @project_id               
 order by [order]                   
 for json path                                               
                                         
        
end   
  