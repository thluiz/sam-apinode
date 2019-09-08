CREATE view vwAddress
as
select a.id, 
		c.id country_id, c.name country,
		pa.person_id, pa.principal, pa.[description], pa.name, 
		a.postal_code, a.street, a.district, a.[state], a.number, a.complement,
		a.street + isnull(' ' + a.number + ' ', '') long_description

from person_address pa
	join [address] a on a.id = pa.address_id
	join country c on c.id = a.country_id