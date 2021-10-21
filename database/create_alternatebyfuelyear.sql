-- Create alternative fuel cars table by car maker fuel type and year

drop table if exists alternatebyfuelyear;

create table alternatebyfuelyear as (
select	 make
		,date
		,model_year
		,fuel
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
		,date
		,model_year
		,fuel
order by make
		,fuel
		,model_year
-- 		,sum(vehicles) desc
-- This is not a top 10 list
-- limit (10)
)