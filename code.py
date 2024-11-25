import pandas as pd
from sqlalchemy import create_engine

# Step 1: Load the Excel file
excel_file = "/home/xerxes/Downloads/Digital Campus - Student List.xlsx"  # Replace with your Excel file path
data = pd.read_excel(excel_file)
print(data)
# Step 2: Validate Data
if data['usn'].duplicated().any():
    raise ValueError("Duplicate USN values found!")
if data['admission_no'].duplicated().any():
    raise ValueError("Duplicate Admission No values found!")

# Step 3: Connect to MySQL Database
# Replace with your MySQL credentials
username = "avnadmin"
password = "AVNS_r5D5rKWPICdlwpEKXRN"
host = "mysql-3cbd064c-dbms-min-proj.h.aivencloud.com"
port = "28723"
database = "placements"

engine = create_engine(f"mysql+pymysql://{username}:{password}@{host}:{port}/{database}")

# Step 4: Insert Data into the Database
try:
    data.to_sql("students", con=engine, if_exists="append", index=False)
    print("Data imported successfully!")
except Exception as e:
    print("Error while importing data:", e)
