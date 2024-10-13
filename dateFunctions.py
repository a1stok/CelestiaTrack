from datetime import datetime
import math

class DateFunctions:

    def return_curr_date(self):
        current_date = datetime.now()

        current_year = current_date.year
        current_month = current_date.month
        current_day = current_date.day

        date = str(current_year) + "-" + str(current_month) + "-" + str(current_day)
        return date

    def return_date_plus_delta_months(self,months):
        current_date = datetime.now()

        current_year = current_date.year
        current_month = current_date.month
        current_day = current_date.day
  
        year = math.floor((current_month + months) / 12)
        month = (current_month + months + 1) % 12

        # date = str(current_year + year) + "-" + str(month) + "-" + str(current_day)
        date = str(current_year) + "-" + str(current_month) + "-" + str(current_day + 1)
        return date
