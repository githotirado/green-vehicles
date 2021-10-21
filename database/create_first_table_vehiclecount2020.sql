drop table if exists vehiclecount2020;

create table vehiclecount2020 (
	date DATE,
	zip_code VARCHAR,
	model_year VARCHAR,
	fuel VARCHAR,
	make VARCHAR,
	duty VARCHAR,
	vehicles INT
);

select count(*) from vehiclecount2020;