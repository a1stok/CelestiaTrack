from apiConnection import API_Connector
from dateFunctions import DateFunctions
from decoder import Decoder
from celesObj import CelesObj
from saveData import DataSaver
from datetime import datetime
import math

class Main:

    names = ["SUN", "MERCURY", "VENUS", "EARTH", "MOON", "MARS",
               "JUPITER", "SATURN", "URANUS", "NEPTUNE", "PLUTO"]
    
    codes = [10, 199, 299, 399, 301, 499,
               599, 699, 799, 899, 999]

    objects = []

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


    def __init__(self):
        self.objects = []

    # Method for debugging/testing purposes only
    def print2DArray(data):
        if data is not None:  
            for row in data:
                for element in row:
                    print(str(element), end=' ')
            print()  # Move to the next line after each row
        else:
            print("No data collected.")

 
    def getObjectData(self):
        dates = DateFunctions()

        curr_date = dates.return_curr_date()
        final_date = dates.return_date_plus_delta_months(1)

        connector = API_Connector()

        i = 0

        print(5)

        for command in self.codes:
            # Initializes input values for the API call 
            API_Connector.setRequestInfo(str(command), curr_date, final_date)
            # Requests ephemeris data from JPL website
            data = API_Connector.getRequestInfo(self.names[i])
            # API_Connector.getVectors()
            decoder = Decoder()

            # Decodes data from results.txt
            # data = decoder.decode()

            # self.objects.append(CelesObj(self.names[i], data))

            # dataSave = DataSaver()

            # dataSave.saveData(self.names[i], data)

            i += 1

            # main = Main()
            # Main.print2DArray(data)

        


#--------------------------------------------------------
# Code for if we ever need to test data variable
# if data is not None:  
#     for row in data:
#         for element in row:
#             print(str(element), end=' ')
#         print()  # Move to the next line after each row
# else:
#     print("No data collected.")
#--------------------------------------------------------