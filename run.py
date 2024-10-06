#This file demonstrates how Main class can be run

from main import Main

# Param 1: Initial date
# Param 2: Final date
# Param 3: Step size (Time interval between each data point)
mainClass = Main('2024-03-19','2024-04-19', '1 h')

# Main method
mainClass.getObjectData()