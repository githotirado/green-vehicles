-- Total alternate cars counts by make and zip only
drop table if exists alternatebymakezip;

create table alternatebymakezip as (
select	 make
		,zip_code
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
group by make
		,zip_code
order by make
		,zip_code
);