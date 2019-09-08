create view vwCardHistory
as
	select ch.id, card_id, 
		responsible_id, 
		history_type history_type_id, echt.[name] history_type,
		[description], created_on,
		created_during_card_id
	from card_history ch 
		join vwPerson p on ch.responsible_id = p.id
		join enum_card_history_type echt on echt.id = ch.history_type