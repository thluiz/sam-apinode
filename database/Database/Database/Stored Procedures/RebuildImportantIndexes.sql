﻿create procedure RebuildImportantIndexes
as
begin

    ALTER INDEX ALL ON account REBUILD WITH (ONLINE = ON); 
    ALTER INDEX ALL ON account_balance REBUILD WITH (ONLINE = ON); 

    ALTER INDEX ALL ON incident REBUILD WITH (ONLINE = ON); 
    ALTER INDEX ALL ON person_incident REBUILD WITH (ONLINE = ON); 
    ALTER INDEX ALL ON incident_treatment REBUILD WITH (ONLINE = ON); 

    ALTER INDEX ALL ON person REBUILD WITH (ONLINE = ON);
    ALTER INDEX ALL ON person_schedule REBUILD WITH (ONLINE = ON); 
    ALTER INDEX ALL ON person_comment REBUILD WITH (ONLINE = ON); 
    ALTER INDEX ALL ON person_domain  REBUILD WITH (ONLINE = ON);
    ALTER INDEX ALL ON person_contact  REBUILD WITH (ONLINE = ON);
    ALTER INDEX ALL ON person_role  REBUILD WITH (ONLINE = ON);
    ALTER INDEX ALL ON person_relationship  REBUILD WITH (ONLINE = ON);
    ALTER INDEX ALL ON person_voucher  REBUILD WITH (ONLINE = ON);

    ALTER INDEX ALL ON [address] REBUILD WITH (ONLINE = ON);
    ALTER INDEX ALL ON person_address REBUILD WITH (ONLINE = ON); 

    ALTER INDEX ALL ON activity_sumary REBUILD WITH (ONLINE = ON); 
    ALTER INDEX ALL ON members_sumary REBUILD WITH (ONLINE = ON); 

    ALTER INDEX ALL ON card REBUILD WITH (ONLINE = ON); 
    ALTER INDEX ALL ON card_history REBUILD WITH (ONLINE = ON); 
    ALTER INDEX ALL ON card_step REBUILD WITH (ONLINE = ON); 
    ALTER INDEX ALL ON card_commentary REBUILD WITH (ONLINE = ON); 
    ALTER INDEX ALL ON person_card REBUILD WITH (ONLINE = ON); 

    ALTER INDEX ALL ON [user] REBUILD WITH (ONLINE = ON); 
    ALTER INDEX ALL ON voucher REBUILD WITH (ONLINE = ON); 
    ALTER INDEX ALL ON branch_voucher  REBUILD WITH (ONLINE = ON);
    ALTER INDEX ALL ON branch REBUILD WITH (ONLINE = ON); 
    ALTER INDEX ALL ON branch_map REBUILD WITH (ONLINE = ON); 
    ALTER INDEX ALL ON branch_product REBUILD WITH (ONLINE = ON); 

    ALTER INDEX ALL ON product  REBUILD WITH (ONLINE = ON);
    ALTER INDEX ALL ON branch_product  REBUILD WITH (ONLINE = ON);
    ALTER INDEX ALL ON user_configuration  REBUILD WITH (ONLINE = ON);

end