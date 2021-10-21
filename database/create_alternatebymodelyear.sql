-- Create alternative fuel cars table by car maker and model year

drop table if exists alternatebymodelyear;

create table alternatebymodelyear as (
select	 make
		,model_year
-- 		,fuel
		,sum(vehicles)
from 	 vehiclecount2020
where  fuel in (
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
		,model_year
-- 		,fuel
order by make
-- 		,fuel
		,model_year
-- 		,sum(vehicles) desc
-- This is not a top 10 list
-- limit (10)
)