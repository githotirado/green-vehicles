-- Total alternate cars counts by zip only
drop table if exists alternatebyzip;

create table alternatebyzip as (
select	 zip_code
		,sum(vehicles)
from 	 vehiclecount2020
where   fuel in (
				 'Battery Electric'
				,'Plug-in Hybrid'
-- 				,'Diesel and Diesel Hybrid'
				,'Flex-Fuel'
-- 				,'Hybrid Gasoline'
				,'Hydgogen Fuel Cell'
				,'Natural Gas'
-- 				,'Other'
-- 				,'Gasoline'
			    )
group by zip_code
-- order by zip_code
order by sum(vehicles) desc
);