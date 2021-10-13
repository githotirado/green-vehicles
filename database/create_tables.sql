drop table if exists vehicleCount2020;

create table vehicleCount2020 (
	date DATE,
	zip_code INT,
	model_year INT,
	fuel VARCHAR,
	make VARCHAR,
	duty VARCHAR,
	vehicles INT
);

-- COPY vehicleCount2020(date, zip_code, model_year, fuel, make, duty, vehicles)
-- FROM '/Users/henrytirado/git/usc_homeworkb/tbdProject3/template/static/data/vehicle-count-as-of-1-1-2020.csv'
-- DELIMITER ','
-- CSV HEADER;