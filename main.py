from apiConnection import API_Connector
from dateFunctions import DateFunctions
from decoder import Decoder
from celesObj import CelesObj
from datetime import datetime
import math

class Main:

    # 3 parameters sent into API code
    date_i = ""
    date_f = ""
    step_size = ""
    command = ""
    name = ""
    format = False

    commands= []
    names = []
        
    def makeGroup(self, date_i, date_f, step_size, commands, names, format):
        self.date_i = date_i
        self.date_f = date_f
        self.step_size = step_size
        self.commands = commands
        self.names = names
        self.format = format

    def makeIndiv(self, date_i, date_f, step_size, command, name, format):
        self.date_i = date_i
        self.date_f = date_f
        self.step_size = step_size
        self.command = command
        self.name = name
        self.format = format
    
    # Method for debugging/testing purposes only
    def print2DArray(data):
        if data is not None:  
            for row in data:
                for element in row:
                    print(str(element), end=' ')
            print()  # Move to the next line after each row
        else:
            print("No data collected.")
        
    def getGroupInfo(self):
        counter = 0
        for code in self.commands:
            API_Connector.setRequestInfo(self.commands[counter], self.date_i, self.date_f, self.step_size)
            data = API_Connector.getRequestInfo(self.names[counter])

            if self.format:
                decoder = Decoder()
                decoder.formatData(self.names[counter])

            counter += 1

        # Makes sure request file isn't corrupted
        API_Connector.setRequestInfo(self.commands[0], self.date_i, self.date_f, self.step_size)
    
    def getIndivInfo(self):
        connector = API_Connector()

        # Initializes input values for the API call 
        API_Connector.setRequestInfo(self.command, self.date_i, self.date_f, self.step_size)
        # Requests vector data from JPL website
        data = API_Connector.getRequestInfo(self.name)
        # API_Connector.getVectors()
        if self.format:
            decoder = Decoder()
            decoder.formatData(self.name)

        API_Connector.setRequestInfo(self.command, self.date_i, self.date_f, self.step_size)

        # For debugging only:
        # Main.print2DArray(extracted_raw_vector_data)


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