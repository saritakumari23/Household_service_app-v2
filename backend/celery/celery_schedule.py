from celery.schedules import crontab
from flask import current_app as app
from backend.celery.tasks import email_reminder
from backend.models import User, UserRoles, get_data_by_email

celery_app = app.extensions['celery']
def get_users_with_role_2():
    return [
        user.email for user in 
        User.query
        .join(UserRoles, User.id == UserRoles.user_id)
        .filter(UserRoles.role_id == 2)
        .all()
    ]

@celery_app.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    profs = get_users_with_role_2()
    for prof in profs:
        sender.add_periodic_task(crontab(hour=10, minute=57), email_reminder.s(prof, 'Reminder to Log In', '<h1> Log In to HouseHold Service App </h1>') )

    for prof in profs:
        data = get_data_by_email(prof)
        total_requests = data['total_requests']
        completed_requests = data['completed_requests']
        requested_requests = data['requested_requests']
        assigned_requests = data['assigned_requests']

        sender.add_periodic_task(crontab(hour=10, minute=57), email_reminder.s(prof, 'Montly Report', 
f'''
<h2>Hello Professional,</h2>
<p>These are your service statistics until this month:</p>

<div class="stats">
    <div class="stat-item">
        Total Requests: <strong>{total_requests}</strong>
    </div>
    <div class="stat-item">
        Completed Requests: <strong>{completed_requests}</strong>
    </div>
    <div class="stat-item">
        Pending Requests: <strong>{requested_requests}</strong>
    </div>
    <div class="stat-item">
        Assigned Requests: <strong>{assigned_requests}</strong>
    </div>
</div>

<p>Thank you for your service!</p>
'''

    ))
