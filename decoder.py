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