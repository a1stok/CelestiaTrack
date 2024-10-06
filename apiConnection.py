import sys
import requests
from astroquery.jplhorizons import Horizons

class API_Connector:
    
    SUN = 10
    MERCURY = 199
    VENUS = 299
    EARTH = 399
    MOON = 301
    MARS = 499
    JUPITER = 599
    SATURN = 699
    URANUS = 799
    NEPTUNE = 899
    PLUTO = 999

    def getRequestInfo(name):
        f = open("my_input_file.txt")

        url = 'https://ssd.jpl.nasa.gov/api/horizons_file.api'
        r = requests.post(url, data={'format':'text'}, files={'input': f})

        f.close()

        with open(str("./planetData/" + name + ".txt"), 'w') as output_file:
            output_file.write(r.text)

        return r

    #Modifies the API request file, with the neccessary parameters
    def setRequestInfo(COMMAND, START_TIME, STOP_TIME, STEP_SIZE):
        with open("my_input_file.txt", 'r') as f:
            lines = f.readlines()

        with open("my_input_file.txt", 'w') as f:
            for line in lines:
                if line.startswith("COMMAND"):
                    f.write("COMMAND='" + COMMAND + "'\n") 
                elif line.startswith("START_TIME"):
                    f.write("START_TIME='" + START_TIME + "'\n") 
                elif line.startswith("STOP_TIME"):
                    f.write("STOP_TIME='" + STOP_TIME + "'\n")
                elif line.startswith("STEP_SIZE"):
                    f.write("STEP_SIZE='" + STEP_SIZE + "'\n")
                else:
                    f.write(line)
    def getVectors():

        # Define the object and time range
        obj = Horizons(id='399', location='500@0', epochs={'start':'2023-01-01', 'stop':'2023-01-02', 'step':'1d'})

        # Fetch vectors
        vectors = obj.vectors()


        with open('results.txt', 'w') as file:
            file.write("Epoch (JD)    X (AU)    Y (AU)    Z (AU)    VX (AU/day)    VY (AU/day)    VZ (AU/day)\n")
    
            # Write each row of vector data
            for row in vectors:
                file.write(f"{row['datetime_jd']}    {row['x']}    {row['y']}    {row['z']}    {row['vx']}    {row['vy']}    {row['vz']}\n")

        return vectors

# Sample API Connection Input File:
# !$$SOF
# COMMAND='499'
# OBJ_DATA='YES'
# MAKE_EPHEM='YES'
# TABLE_TYPE='OBSERVER'
# CENTER='500@399'
# START_TIME='2024-04-01'
# STOP_TIME='2024-12-20'
# STEP_SIZE='1 d'
#QUANTITIES='1,9,20,23,24,29'