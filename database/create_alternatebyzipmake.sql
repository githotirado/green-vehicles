-- Total alternate cars counts by zip and make only
drop table if exists alternatebyzipmake;

create table alternatebyzipmake as (
select	 zip_code
		,make
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
		,make
-- order by zip_code
order by zip_code
		,make
);