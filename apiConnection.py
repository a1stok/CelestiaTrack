import sys
import requests

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
                    f.write("COMMAND='" + str(COMMAND) + "'\n") 
                elif line.startswith("START_TIME"):
                    f.write("START_TIME='" + START_TIME + "'\n") 
                elif line.startswith("STOP_TIME"):
                    f.write("STOP_TIME='" + STOP_TIME + "'\n")
                elif line.startswith("STEP_SIZE"):
                    f.write("STEP_SIZE='" + STEP_SIZE + "'\n")
                else:
                    f.write(line)

# Sample API Connection Input File:
# !$$SOF
# COMMAND='499'
# OBJ_DATA='YES'
# MAKE_EPHEM='YES'
# TABLE_TYPE='VECTORS'
# CENTER='500@399'
# START_TIME='2024-04-01'
# STOP_TIME='2024-12-20'
# STEP_SIZE='1 d'
# QUANTITIES='1,9,20,23,24,29'