class DataSaver:
    def saveData(self, name, data):
        with open("./planetData/" + name + ".txt", "w") as file:
            # Write the column headers
            file.write("Epoch (JD)    X (AU)    Y (AU)    Z (AU)    VX (AU/day)    VY (AU/day)    VZ (AU/day)\n")
    
            # Write each row of vector data
            for row in data:
                for element in row:
                    file.write(str(row))
                print("\n")
        # with open('results.txt', 'w') as output_file:
        #     output_file.write(data.text)

# import pandas as pd

# class DataSaver:
#     def saveData(self, name, data):
#         # Convert the data into a pandas DataFrame
#         df = pd.DataFrame(data)
        
#         # Rename the columns to match the desired output
#         df.columns = ['Epoch (JD)', 'X (AU)', 'Y (AU)', 'Z (AU)', 'VX (AU/day)', 'VY (AU/day)', 'VZ (AU/day)']
        
#         # Save the DataFrame to a .txt file (CSV format) or any other format
#         df.to_csv(f"./planetData/{name}.txt", sep=" ", index=False)
