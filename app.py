from flask import Flask, jsonify, render_template, request, redirect
import pandas as pd 
import json 
import psycopg2

#################################################
# Flask Setup
#################################################
app = Flask(__name__)

#################################################
# Database Setup
#################################################

from sqlalchemy import create_engine
from config import username, password, host, port, database
connection_string = f'{username}:{password}@{host}:{port}/{database}'
engine = create_engine(f'postgresql://{connection_string}')



#Flask Route 
@app.route("/")
def index(): 
    return render_template("index.html")

@app.route("/detail")
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


if __name__ == "__main__":
    app.run()