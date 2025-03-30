import os
from flask import current_app as app, jsonify, render_template,  request, send_file
from flask_security import auth_required, verify_password, hash_password, current_user
from flask_restful import fields, marshal_with
from backend.models import Customer, Professional, Request, Service, User, UserRoles, db, make_user_customer, make_user_professional
from datetime import datetime
from backend.celery.tasks import add, create_csv
from celery.result import AsyncResult

datastore = app.security.datastore
cache = app.cache

@app.get('/')
def home():
    return render_template('index.html')

@app.route('/api/generate-csv', methods=['POST'])
@auth_required("token")
def generate_csv():
    if current_user.email !="sarita@iitm.com":
        return {"msg": "Not Allowed"}, 400
    task = create_csv.delay()
    return jsonify({"task_id": task.id, "message": "CSV generation task started"}), 202

@app.get("/get_csv/<id>")
@auth_required('token')
def get_csv(id):
    if current_user.email != "sarita@iitm.com":
        return {"msg": "Not Allowed"}, 403
    my_result = AsyncResult(id)

    if my_result.ready():
        filename = f'request_data_{id}.csv'
        file_path = os.path.join('./backend/celery/user-downloads', filename)
        if os.path.exists(file_path):
            return send_file(file_path, as_attachment=True, download_name=filename)
        else:
            return {"msg": "File not found"}, 404
    else:
        return {"msg": "Task not ready"}, 202

@app.get('/cache')
@cache.cached(timeout = 5)
def cache_time():
    return {"time" : str(datetime.now())}

@app.route('/celery-test')
def celery_test():
    task = add.delay(10, 20)
    return {"task_id": task.id}, 200

@app.get("/get_celery_test_data/<id>")
def get_test_data(id):
    my_result = AsyncResult(id)

    if my_result.ready():
        return {"result": my_result.result}
    else:
        return {"msg": "Task not ready"}, 405


service_fields = {
    'id': fields.Integer,
    'name': fields.String,
    'price': fields.Integer,
    'time_required': fields.Integer,
    'description': fields.String
}

@app.get('/api/services')
@cache.cached(timeout=10)
@marshal_with(service_fields)
def services():
    services = Service.query.all()
    return services

@app.get('/api/name_service')
def name_service():
    res = {}
    services = Service.query.all()
    for service in services:
        res[service.id] = service.name
    return res

@app.get('/api/profreview/<int:prof_id>')
@auth_required('token')
def profreview(prof_id):
    reqs = Request.query.filter_by(professional_id=prof_id).all()
    prof = Professional.query.get(prof_id).name
    
    reviews = [{"Professional": prof}]
    for req in reqs:
        if not req.remarks:
            continue
        customer = Customer.query.get(req.customer_id)
        reviews.append({
            "cust": {
                "id": customer.id,
                "name": customer.name,
            },
            "review": req.remarks
        })
    return jsonify(reviews)

@app.put('/api/complete/<int:req_id>')
@auth_required('token')
def complete(req_id):
    request = Request.query.get(req_id)
    
    if not request:
        return {"msg": "Not Able to Find Request"}, 404
    
    if request.customer_id != current_user.id:
        return {"msg": "Not Allowed"}, 403
    
    if request.service_status != "assigned":
        return {"msg": "Request is not assigned"}, 400
    
    request.service_status = "completed"
    request.date_of_completion = datetime.utcnow()  
    db.session.commit()
    
    return {"msg": "Updated Successfully"}, 200

@app.get('/protected')
@auth_required('token')
def protected():
    return '<h1> not Heloi by auth user</h1>'

@auth_required('token')
@app.post('/api/acceptProf/<int:prof_id>')
def acceptProf(prof_id):
    if current_user.email !="sarita@iitm.com":
        return {"msg": "Not Allowed"}, 400

    prof = Professional.query.get(prof_id)
    if prof:
        prof.accepted = True
        db.session.commit()

        return {"msg": "Accepted Succefully"}
    else:
        return {"msg": "Professional not found"}
    
@auth_required('token')
@app.delete('/api/deleteProf/<int:prof_id>')
def deleteProf(prof_id):
    # Authorization check
    if current_user.email != "sarita@iitm.com":
        return {"msg": "Not Allowed"}, 403

    # Validate prof_id
    if prof_id <= 0:
        return {"msg": "Invalid Professional ID"}, 400

    # Query the Professional record
    prof = Professional.query.get(prof_id)
    if not prof:
        return {"msg": "Professional not found"}, 404

    # Attempt to delete the record
    try:
        db.session.delete(prof)
        db.session.commit()
        return {"msg": "Professional deleted successfully"}, 200
    except Exception as e:
        db.session.rollback()
        return {"msg": f"An error occurred: {str(e)}"}, 500



@auth_required('token')
@app.post('/api/customerComplete')
def customerComplete():
    data = request.get_json()
    user_id= data.get('user_id')
    name= data.get('name')
    pincode= data.get('pincode')
    address=data.get('address')

    make_user_customer(user_id= user_id, name= name, pincode= pincode, address= address)

    return jsonify({'message' : 'Done'}), 200

@auth_required('token')
@app.post('/api/profComplete')
def profComplete():
    data = request.get_json()
    user_id= data.get('user_id')
    name= data.get('name')
    pincode= data.get('pincode')
    address=data.get('address')
    experience= data.get('experience')
    description= data.get('description')
    service_id= data.get('service_id')

    make_user_professional(user_id= user_id, name= name, pincode= pincode, address= address, experience= experience, description=description, service_id= service_id)

    return jsonify({'message' : 'Done'}), 200

@auth_required('token')
@app.put('/api/unblock/<int:user_id>')
def unblock_user(user_id):
    # Ensure only authorized user can unblock others
    if current_user.email != "sarita@iitm.com":
        return {"msg": "Not Allowed"}, 403

    try:
        # Query the user by ID
        user = User.query.filter_by(id=user_id).first()

        # If the user does not exist
        if not user:
            return {"msg": "User Not Found"}, 404

        # Unblock the user by setting 'active' to True
        user.active = True

        role = UserRoles.query.filter_by(user_id=user_id).first()
        if role and role.role_id == 2:  # Professional
            prof = Professional.query.filter_by(id=user_id).first()
            if prof:
                prof.accepted = True

        db.session.commit()
        return {"msg": "Unblocked Successfully"}, 200

    except Exception as e:
        # Handle any unexpected errors
        return {"msg": "An unexpected error occurred", "error": str(e)}, 500


@auth_required('token')
@app.delete('/api/block/<int:user_id>')
def block_user(user_id):
    # Ensure only authorized user can block others
    if current_user.email != "sarita@iitm.com":
        return {"msg": "Not Allowed"}, 403

    try:
        # Query the user by ID
        user = User.query.filter_by(id=user_id).first()

        if not user:
            return {"msg": "User Not Found"}, 404

        role = UserRoles.query.filter_by(user_id=user_id).first()
        if role:
            if role.role_id == 2:  # Professional
                # Delete related requests and update professional's status
                Request.query.filter_by(professional_id=user_id, service_status="requested").delete()
                Request.query.filter_by(professional_id=user_id, service_status="assigned").delete()
                prof = Professional.query.filter_by(id=user_id).first()
                if prof:
                    prof.accepted = False

            elif role.role_id == 3:  # Customer
                # Delete related requests for the customer
                Request.query.filter_by(customer_id=user_id, service_status="requested").delete()
                Request.query.filter_by(customer_id=user_id, service_status="assigned").delete()

        # Block the user by setting 'active' to False
        user.active = False
        db.session.commit()
        return {"msg": "Blocked Successfully"}, 200

    except Exception as e:
        # Handle any unexpected errors
        return {"msg": "An unexpected error occurred", "error": str(e)}, 500

user_fields = {
    'id': fields.Integer,
    'email': fields.String,
    'name': fields.String,
    'role': fields.String,
    'address': fields.String,
    'pincode': fields.String,
    'active': fields.Boolean
}

@auth_required('token')
@marshal_with(user_fields)
@app.get('/api/user')
def allUser():
    if current_user.email != "sarita@iitm.com":
        return {"msg": "Not Allowed"}, 403
    
    users = User.query.all()
    results = []
    for user in users:
        u = {}
        u["id"] = user.id
        u["email"] = user.email
        u["active"] = user.active
        role_id = UserRoles.query.filter_by(user_id = user.id).first().role_id

        if role_id == 1:
            continue

        if role_id == 2:
            u["role"] = "Professional"
            prof = Professional.query.filter_by(id= user.id).first()
            if not prof:
                continue
            u["address"] = prof.address
            u["pincode"] = prof.pincode
            u["name"] = prof.name
        elif role_id == 3:
            u["role"] = "Customer"
            cust = Customer.query.filter_by(id= user.id).first()
            if not cust:
                continue
            u["name"] = cust.name
            u["address"] = cust.address
            u["pincode"] = cust.pincode
        results.append(u)
        
    return results
    
@app.route('/login', methods=["POST"])
def login():
    data = request.get_json()

    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"msg" : "Invalid Inputs"}), 400
    
    user = User.query.filter_by(email = email).first()

    if not user:
        return jsonify({"msg" : "User not exsist"}), 400
    
    if user.active == False:
        return jsonify({"msg" : "Blocked User"}), 403
    
    if verify_password(password, user.password):
        return jsonify({'token' : user.get_auth_token(), 'email' : user.email, 'role' : user.roles[0].name, 'id' : user.id})
    
    return jsonify({'message' : 'Wrong Password'}), 400

@app.route('/register', methods=["POST"])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    role = data.get('role')

    if not email or not password or role not in ["Customer", "Professional"]:
        return jsonify({"message": "Invalid Inputs"}), 400
    
    user = datastore.find_user(email = email)

    if user:
        return jsonify({'msg': "Email already registered"}), 400
    
    try:
        if role == "Customer":
            datastore.create_user(email = email, password = hash_password(password), roles = [role], active = True)
        
        else:
            datastore.create_user(email = email, password = hash_password(password), roles = [role], active = True)
        db.session.commit()
        return jsonify({"msg": "User Created Successfully"}), 200
    except:
        db.session.rollback()
        return jsonify({"msg": "Error while creating user"}), 400


