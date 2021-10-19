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

@app.route("/top10zip")
def top10zip():
    df = pd.read_sql_table(table_name="top10byzip", con = engine.connect(), schema ="public")
    return jsonify(df.to_json(orient="records"))

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
    # Use Pandas filtering to get only requested car make, select needed columns, set index
    altbymakezip_df = altbymakezip_df.loc[altbymakezip_df["make"] == carmake]
    altbymakezip_df = altbymakezip_df[["zip_code","sum"]].set_index("zip_code")
    return jsonify(altbymakezip_df.to_dict(orient="index"))
    # altbymakezip_df = altbymakezip_df.set_index("make")
    # return jsonify(altbymakezip_df.to_dict(orient="records"))



if __name__ == "__main__":
    app.run()