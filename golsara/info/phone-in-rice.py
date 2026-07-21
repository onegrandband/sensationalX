import time

class Phone:
    def __init__(self):
        self.state = "wet"
        self.internal_glue = False
        self.corrosion_level = 0

    def put_in_rice(self):
        print("Placing phone in a bowl of rice...")
        time.sleep(1)
        
        # Rice acts too slowly
        self.corrosion_level += 50
        
        # Starch and dust combine with water
        self.internal_glue = True
        self.state = "broken"
        
        print("Result: Rice dust made a sticky paste inside the phone.")
        print("Result: The phone is now permanently broken due to rust.")
print("Fun Python Phone-To-Rice Game!")
my_phone = Phone()
my_phone.put_in_rice()
