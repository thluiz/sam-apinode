  
CREATE procedure SavePersonAvatarProcessed(@avatar_img varchar(80), @type varchar(3))  
as  
begin  
  
    if(@type = 'sm')  
        update person set avatar_sm = 1 where avatar_img = @avatar_img  and avatar_sm = 0  
      
    if(@type = 'md')  
        update person set avatar_md = 1 where avatar_img = @avatar_img and avatar_md = 0 
        
    if(@type = 'esm')  
        update person set avatar_esm = 1 where avatar_img = @avatar_img and avatar_esm = 0           
  
end