class Decoder:
    def extract_vector_data(self, name):
        with open("./planetData/" + name + ".txt", 'r') as f:
            lines = f.readlines()

        # Initialize an empty array
        data = []

        collecting = False  # Flag to indicate if we are between $$SOE and $$EOE

        # Process each line
        for line in lines:
            line = line.strip()  # Remove any leading/trailing whitespace
            
            if line.startswith("$$SOE"):
                collecting = True  # Start collecting data
                continue  # Skip the $$SOE line itself
            
            if line.startswith("$$EOE"):
                collecting = False  # Start collecting data
                break  # Skip the $$SOE line itself

            if collecting:
                # Split the line by commas and store in the array
                row = line.split(' ')  # Adjust split logic if needed (e.g., spaces)
                row = [element.strip() for element in row]  # Clean up spaces
                data.append(row)  # Append to array
        return data
    
    def formatData(self, name):
        with open("./planetData/" + name + ".txt", 'r') as f:
            lines = f.readlines()

        with open("./planetData/" + name + ".txt", 'w') as f:

            deleting = True  # Flag to indicate if we are between $$SOE and $$EOE

            for line in lines:
                line = line.strip()
                
                if line.startswith("$$SOE"):
                    deleting = False
                
                if line.startswith("$$EOE"):
                    deleting = True

                if deleting:
                    f.write("")
                else:
                    string = str(line)

                    #Format info
                    if (string.startswith("X")):
                        string = "POS  : " + string
                    elif (string.startswith("VX")):
                        string = "VELOC: " + string
                    elif (string.endswith("TDB")):
                        string = "TIME : " + string
                    else:
                        string = "OTHER: " + string

                    # Write to file
                    if (line.startswith("$$SOE")):
                        f.write("")
                    elif (string.startswith("TIME")):
                        f.write("____________________________________________________________________________________")
                        f.write("\n")
                        f.write(string)
                        f.write("\n")
                    else:  
                        f.write(string)
                        f.write("\n")