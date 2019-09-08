CREATE procedure SavePersonContact(    
 @person_id int,    
 @contact_type int,    
 @contact varchar(250),    
 @details varchar(max),  
 @principal bit  
)    
as    
begin    
    
 insert into person_contact(person_id, contact, contact_type, details, principal)    
 values (@person_id, @contact, @contact_type, @details, @principal)    
    
 exec CheckPeopleStatus @person_Id

end