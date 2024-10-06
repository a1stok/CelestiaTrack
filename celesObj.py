class CelesObj:
    extracted_raw_vector_data = []
    order_vector_data = []
    
    name = ""

    def __init__(self, name, extracted_raw_vector_data):
        self.name = name
        self.extracted_raw_vector_data = extracted_raw_vector_data