create table top10byzip as (
select zip_code,
		fuel,
		sum(vehicles)
from vehiclecount2020
group by zip_code, fuel
order by sum(vehicles) desc
limit (10))