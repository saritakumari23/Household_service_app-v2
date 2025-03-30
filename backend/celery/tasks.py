import os
from celery import shared_task
import time
import flask_excel
from backend.celery.mail_service import send_email
from backend.models import Request

@shared_task(ignore_result=False)
def add(x, y):
    time.sleep(20)
    return x + y

@shared_task(bind=True, ignore_result=False)
def create_csv(self):
    try:
        resource = Request.query.filter_by(service_status="completed").all()

        task_id = self.request.id
        filename = f'request_data_{task_id}.csv'
        column_names = [column.name for column in Request.__table__.columns]
        csv_out = flask_excel.make_response_from_query_sets(resource, column_names=column_names, file_type='csv')

        file_path = os.path.join('./backend/celery/user-downloads', filename)
        with open(file_path, 'wb') as file:
            file.write(csv_out.data)
        
        return filename
    except Exception as e:
        print(f"Error creating CSV: {str(e)}")
        return None
    
@shared_task(ignore_result = True)
def email_reminder(to, sub, content):
    send_email(to, sub, content)