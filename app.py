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




if __name__ == "__main__":
    app.run()