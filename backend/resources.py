from datetime import datetime
from flask import jsonify, request, current_app as app
from flask_restful import Api, Resource, fields, marshal_with
from flask_security import auth_required, current_user
from backend.models import Customer, Professional, Service, User, db, Request, UserRoles, make_user_professional
api = Api(prefix='/api')

service_fields = {
    'id': fields.Integer,
    'name': fields.String,
    'price': fields.Integer,
    'time_required': fields.Integer,
    'description': fields.String
}

class ServiceAPI(Resource):

    @marshal_with(service_fields)
    # @cache.memoize()
    def get(self, service_id):
        service = Service.query.get(service_id)
        return service
        
    @auth_required('token')
    def put(self, service_id):
        if current_user.email != "sarita@iitm.com":
            return {"msg": "Not Allowed"}, 403

        data = request.get_json()
        description = data.get("description")
        price = data.get("price")
        time_required = data.get("time_required")

        service = Service.query.get(service_id)
        if not service:
            return {"msg": "Service not found"}, 404

        if description:
            service.description = description
        if price:
            service.price = price
        if time_required:
            service.time_required = time_required

        try:
            db.session.commit()
            return {"msg": "Updated Successfully"}, 200
        except Exception as e:
            db.session.rollback()
            return {"msg": "Failed to update service", "error": str(e)}, 500

    @auth_required('token')
    def delete(self, service_id):
        try:
            requests = Request.query.filter_by(service_id=service_id).all()
            for request in requests:
                db.session.delete(request)

            professionals = Professional.query.filter_by(service_id=service_id).all()
            for professional in professionals:
                user_id = professional.id
                
                UserRoles.query.filter_by(user_id=user_id).delete()
                
                db.session.delete(professional)
                user = User.query.get(user_id)
                if user:
                    db.session.delete(user)

            service = Service.query.get(service_id)
            if service:
                db.session.delete(service)
            
            db.session.commit()
            return {"msg": "Service deleted successfully"}, 200
        except Exception as e:
            db.session.rollback()
            return {"msg": "Failed to delete service"}, 500

    
class ServiceListAPI(Resource):
    
    @auth_required('token')
    def post(self):
        if current_user.email != "sarita@iitm.com":
            return {"msg": "Not Allowed"}, 400

        data = request.get_json()
        name = data.get('name')
        price = data.get('price')
        description = data.get('description')
        time_required = data.get('time_required')

        if not name or not price or not description or not time_required:
            return {'msg': 'Invalid Inputs'}, 400
        
        service = Service(name= name, price= price, time_required= time_required, description= description)

        db.session.add(service)
        db.session.commit()
        return {"msg": "Service Created Succesfully"}, 200
    
professional_fields = {
    'id': fields.Integer,
    'name': fields.String,
    'pincode': fields.String,
    'address': fields.String,
    'experience': fields.String,
    'description': fields.String,
    'service_id': fields.Integer
}

class ProfessionalAPI(Resource):

    
    @marshal_with(professional_fields)
    @auth_required('token')
    # @cache.memoize()
    def get(self, service_id):
        prof = Professional.query.filter_by(service_id = service_id, accepted= True).all()
        return prof


class ProfessionalListAPI(Resource):

    @auth_required('token')
    @marshal_with(professional_fields)
    def get(self):
        if current_user.accepted == False:
            return {"msg": "You are Blocked by Admin"}, 403
        professionals = Professional.query.filter_by(accepted= True).all()
        return professionals
    

class AdminListAPI(Resource):
    @auth_required('token')
    @marshal_with(professional_fields)
    def get(self):
        if current_user.email !="sarita@iitm.com":
            return {"msg": "Not Allowed"}, 400
        professionals = Professional.query.filter_by(accepted= False).all()
        return professionals

request_fields = {
    'id': fields.Integer,
    'service_id': fields.Integer,
    'customer_id': fields.Integer,
    'professional_id': fields.Integer,
    'date_of_request': fields.DateTime,
    'date_of_completion': fields.DateTime,
    'service_status': fields.String,
    'remarks': fields.String,
    'service_name': fields.String,  
    'professional_name': fields.String ,
    "customer_address": fields.String,
    "customer_name": fields.String 
}

class RequestListAPI(Resource):
    @auth_required('token')
    @marshal_with(request_fields)
    def get(self):
        role = UserRoles.query.filter_by(user_id=current_user.id).first()
        if role.role_id == 3:
            requests = Request.query.filter_by(customer_id=current_user.id).all()
        elif role.role_id == 2:
            requests = Request.query.filter_by(professional_id=current_user.id).all()
        else:
            return {"msg": "Not Allowed"}, 400

        result = []
        for req in requests:
            service = Service.query.filter_by(id=req.service_id).first()
            service_name = service.name if service else None

            professional = Professional.query.filter_by(id=req.professional_id).first()
            if not professional:
                return {"remark": "Uncompleted Profile"}, 400
            professional_name = professional.name

            customer = Customer.query.filter_by(id=req.customer_id).first()
            if not customer:
                return {"remark": "Uncompleted Customer Profile"}, 400
            customer_address = customer.address

            result.append({
                "id": req.id,
                "service_id": req.service_id,
                "customer_id": req.customer_id,
                "professional_id": req.professional_id,
                "date_of_request": req.date_of_request,
                "date_of_completion": req.date_of_completion,
                "service_status": req.service_status,
                "remarks": req.remarks,
                "service_name": service_name,
                "professional_name": professional_name,
                "customer_address": customer_address,
                "customer_name": customer.name
            })
        return result
    
    @auth_required('token')
    def delete(self):
        role = UserRoles.query.filter_by(user_id=current_user.id).first()
        if role.role_id != 2: 
            return {"msg": "Not Allowed"}, 400

        data = request.get_json()
        request_id = data.get('request_id')

        if not request_id:
            return {"msg": "Request ID is required"}, 400

        req = Request.query.filter_by(id=request_id).first()

        if not req:
            return {"msg": "Request not found"}, 404

        if req.service_status != "requested":
            return {"msg": "Request cannot be deleted as it is in the process state already"}, 400
        db.session.delete(req)
        db.session.commit()

        return {"msg": "Request deleted successfully"}, 200
    
    @auth_required('token')
    def put(self):
        role = UserRoles.query.filter_by(user_id=current_user.id).first()
        if role.id == 2:  
            return {"msg": "Not Allowed"}, 400

        data = request.get_json()
        request_id = data.get('request_id')

        if not request_id:
            return {"msg": "Request ID is required"}, 400

        req = Request.query.filter_by(id=request_id).first()

        if not req:
            return {"msg": "Request not found"}, 404

        if req.service_status != "requested":
            return {"msg": "Request cannot be accepted as it is not in the 'requested' state"}, 400

        req.professional_id = current_user.id
        req.service_status = "assigned"

        db.session.commit()

        return {"msg": "Request accepted successfully", "request_id": req.id}, 200
    
    @auth_required('token')
    def post(self):
        user = User.query.filter_by(id = current_user.id).first()
        if not user.active:
            return {"msg": "Blocked User"}, 403
        role = UserRoles.query.filter_by(user_id=current_user.id).first()
        if role.role_id != 3:
            return {"msg": "Not Allowed"}, 400
        data = request.get_json()
        professional_id = data.get('professional_id')

        prof = Professional.query.get(professional_id)

        if not prof or not prof.accepted:
            return {'msg': 'Professional Not Avaiable'}, 404
        service_id = prof.service_id
        
        req = Request(service_id= service_id, customer_id= current_user.id, professional_id= professional_id, date_of_request=datetime.utcnow(), service_status= "requested")

        db.session.add(req)
        db.session.commit()
        return {"msg": "Request Created Succesfully"}, 200
    
customer_fields = {
    'id': fields.Integer,
    'name': fields.String,
    'pincode': fields.String,
    'address': fields.String,
}

class CustomerAPI(Resource):

    @auth_required('token')
    @marshal_with(customer_fields)
    def get(self):
        cust = Customer.query.get(current_user.id)
        if not cust:
            return {"msg": "Not Allowed"}
        return cust
    
    @auth_required('token')
    def put(self):

        # Parse request data
        data = request.get_json()
        name = data.get("name")
        address = data.get("address")
        pincode = data.get("pincode")

        # Find the service by ID
        customer = Customer.query.get(current_user.id)
        if not customer:
            return {"msg": "Not Authorised"}, 403

        # Update the service details
        if name:
            customer.name = name
        if address:
            customer.address = address
        if pincode:
            customer.pincode = pincode

        # Commit the changes to the database
        try:
            db.session.commit()
            return {"msg": "Updated Successfully"}, 200
        except Exception as e:
            db.session.rollback()
            return {"msg": "Failed to update service", "error": str(e)}, 500

class ReviewAPI(Resource):
    @auth_required('token')
    def get(self, request_id):
        request = Request.query.get(request_id)

        if not request:
            return {"msg": "Request Not Found"}, 404

        if request.service_status != "completed" or request.customer_id != current_user.id:
            return {"msg": "Not Allowed"}, 403
        
        remark = request.remarks
        return {"remark": remark}
    
    @auth_required('token')
    def post(self, request_id):
        req = Request.query.get(request_id)

        if not req:
            return {"msg": "Request Not Found"}, 404
        
        if req.service_status != "completed" or req.customer_id != current_user.id:
            return {"msg": "Not Allowed"}, 403
        
        data = request.get_json()
        remarks = data.get("remarks")

        req.remarks = remarks

        db.session.commit()
        return {"msg": "Remark Done"}
        

api.add_resource(ServiceAPI, '/services/<int:service_id>')
api.add_resource(ServiceListAPI, '/services')
api.add_resource(RequestListAPI, '/request')
api.add_resource(AdminListAPI, '/unprof') 
api.add_resource(ProfessionalListAPI, "/prof") 
api.add_resource(ProfessionalAPI, '/prof/<int:service_id>') 
api.add_resource(CustomerAPI, '/cust')
api.add_resource(ReviewAPI, "/review/<int:request_id>")