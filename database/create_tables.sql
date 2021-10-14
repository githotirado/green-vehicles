drop table if exists vehicleCount2020;

create table vehicleCount2020 (
	date DATE,
	zip_code VARCHAR,
	model_year VARCHAR,
	fuel VARCHAR,
	make VARCHAR,
	duty VARCHAR,
	vehicles INT
);

select * from vehicleCount2020;

insert into vehicleCount2020
values ('2020-01-01', '90027', '2018', 'Hybrid', 'Nissan', 'light', 35);

-- COPY vehicleCount2020(date, zip_code, model_year, fuel, make, duty, vehicles)
-- FROM '/Users/henrytirado/git/usc_homeworkb/tbdProject3/template/static/data/vehicle-count-as-of-1-1-2020.csv'
-- DELIMITER ','
-- CSV HEADER;