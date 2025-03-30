from flask import current_app as app
from backend.models import (
    add_service,
    db,
    make_user_customer,
    make_user_professional,
    Service
)
from flask_security import SQLAlchemyUserDatastore, hash_password


def seed_database():
    """
    Function to seed the database with default roles and users.
    """
    with app.app_context():
        db.create_all()

        userdatastore: SQLAlchemyUserDatastore = app.security.datastore

        # Create roles if they don't exist
        userdatastore.find_or_create_role(name='Admin', description='root access')
        userdatastore.find_or_create_role(name='Professional', description='Service Professional')
        userdatastore.find_or_create_role(name='Customer', description='An individual who books a service request')

        # Seed Admin user
        if not userdatastore.find_user(email='sarita@iitm.com'):
            userdatastore.create_user(email='sarita@iitm.com', password=hash_password('admin123'), roles=['Admin'])

        # Seed Customer user
        if not userdatastore.find_user(email='user@iitm.com'):
            user = userdatastore.create_user(email='user@iitm.com', password=hash_password('user123'))
            db.session.commit() 
            make_user_customer(
                user_id=user.id,
                name="Dhruv",
                pincode="110076",
                address="Sarita Vihar, Delhi",
            )
        if not Service.query.filter_by(name="Electrical Appliances Reparing Service").first():
            add_service(name="Electrical Appliances Reparing Service", price=1000, time_required=120, description= "Electrical Appliances includes: Air Conditioner, Washing Machine, Fridge and Television")

        # Seed Professional user
        if not userdatastore.find_user(email='prof@iitm.com'):
            user = userdatastore.create_user(email='prof@iitm.com', password=hash_password('prof123'))
            db.session.commit()  # Commit to assign an ID to the user
            make_user_professional(
                user_id=user.id,
                name="Himanshu Pandey",
                pincode="208011",
                address="Shastri Nagar, Kanpur",
                experience="3 years",
                description="ITI Diploma Holder in Computer Science Engineering",
                service_id=1,
                
            )
            
        # Commit changes
        db.session.commit()


# Initialize and seed the database
with app.app_context():
    db.create_all()
    seed_database()
