from flask import Flask, jsonify, render_template, request, redirect, url_for
import pandas as pd 
import json 
import psycopg2
import os

#################################################
# Flask Setup
#################################################
app = Flask(__name__)

#################################################
# Database Setup
#################################################

from sqlalchemy import create_engine
#### from config import username, password, host, port, database
# Get database configuration variables from local OS variables
username = os.environ.get('DBUSERNAME')
password = os.environ.get('DBPASSWORD')
host = os.environ.get('DBHOST')
port = os.environ.get('DBPORT')
database = os.environ.get('DBDATABASE')
connection_string = f'{username}:{password}@{host}:{port}/{database}'
engine = create_engine(f'postgresql://{connection_string}')



#Flask Route 
@app.route("/index")
def index(): 
    return render_template("index.html")

@app.route("/")
def detail(): 
    return render_template("detail.html")

@app.route("/top10zip")
def top10zip():
    df = pd.read_sql_table(table_name="top10byzip", con = engine.connect(), schema ="public")
    df_json = df.to_dict(orient="records")
    return jsonify(df_json)

@app.route("/alternatebyfuel")
def alternatebyfuel():
    df_alternatebyfuel = pd.read_sql_table(table_name="alternatebyfuel", con = engine.connect(), schema ="public")
    df_alternatebyfuel_json = df_alternatebyfuel.to_dict(orient="records")
    return jsonify(df_alternatebyfuel_json)

@app.route("/alternatebymodelyear")
def alternatebymodelyear():
    df_alternatebymodelyear = pd.read_sql_table(table_name="alternatebymodelyear", con = engine.connect(), schema ="public")
    df_alternatebymodelyear_json = df_alternatebymodelyear.to_dict(orient="records")
    return jsonify(df_alternatebymodelyear_json)

@app.route("/vehiclecount2020")
def vehiclecount2020():
    df_vehiclecount2020 = pd.read_sql_table(table_name="vehiclecount2020", con = engine.connect(), schema ="public")
    df_vehiclecount2020_json = df_vehiclecount2020.to_dict(orient="records")
    return jsonify(df_vehiclecount2020_json)

# Read alternative vehicle counts by zip code from database
@app.route("/altbyzip")
def alternatebyzip():
    altbyzip_df = pd.read_sql_table(table_name="alternatebyzip", con = engine.connect(), schema ="public")
    altbyzip_df = altbyzip_df.set_index("zip_code")
    return jsonify(altbyzip_df.to_dict(orient="index"))

# Read alternative vehicle counts by make and zip code from database
@app.route("/altbymakezip/<carmake>")
def alternatebymakezip(carmake):
    altbymakezip_df = pd.read_sql_table(table_name="alternatebymakezip", con = engine.connect(), schema ="public")
    altbymakezip_df = altbymakezip_df.loc[altbymakezip_df["make"] == carmake]
    altbymakezip_df = altbymakezip_df[["zip_code","sum"]].set_index("zip_code")
    return jsonify(altbymakezip_df.to_dict(orient="index"))

# Read alternative vehicle counts by zip code and make from database
@app.route("/altbyzipmake")
def alternatebyzipmake():
    altbyzipmake_df = pd.read_sql_table(table_name="alternatebyzipmake", con = engine.connect(), schema ="public")
    return jsonify(altbyzipmake_df.to_dict(orient="records"))

@app.route("/alternatebyfuelyear")
def alternatebyfuelyear():
    df_alternatebyfuelyear = pd.read_sql_table(table_name="alternatebyfuelyear", con = engine.connect(), schema ="public")
    df_alternatebyfuelyear_json = df_alternatebyfuelyear.to_dict(orient="records")
    return jsonify(df_alternatebyfuelyear_json)

if __name__ == "__main__":
    app.run()
