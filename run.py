#This file demonstrates how Main class can be run
from flask import Flask, jsonify, request
from main import Main

app = Flask(__name__)


names = ["SUN", "MERCURY", "VENUS", "EARTH", "MOON", "MARS",
               "JUPITER", "SATURN", "URANUS", "NEPTUNE", "PLUTO"]
    
commands = [10, 199, 299, 399, 301, 499,
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


mainClass = Main()

# ______________
# Constructor 1:
# Param 1: Initial date
# Param 2: Final date
# Param 3: Step size (Time interval between each data point)
# Param 4: List of, or individual command (each planet has its own command, listed above)
# Param 5: Lis of, or individual name (capitalize name)
# Param 6: If True, data will be formatted, if False, data will not be formatted
mainClass.makeIndiv('2023-01-01','2025-04-19', '1 d', commands[1], names[1], True)


# Only call this method if arrays were passed into Param 4 & 5:
# mainClass.getGroupInfo()

# Only call this method if values were passed into Param 4 & 5:
mainClass.getIndivInfo()

