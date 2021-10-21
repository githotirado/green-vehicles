-- Create top 10 table from original dataset

drop table if exists top10byzip;

create table top10byzip as (
select	 zip_code
		,fuel
		,sum(vehicles)
from 	 vehiclecount2020
group by zip_code
		,fuel
order by sum(vehicles) desc
limit (10));