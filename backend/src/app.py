"""
API server built with the flask-rest-hello template.
"""
import os
from flask import Flask, request, jsonify
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_bcrypt import Bcrypt
from .utils import APIException, generate_sitemap
from .admin import setup_admin
from .models import db, User

app = Flask(__name__)
app.url_map.strict_slashes = False

db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace("postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'change-this-secret')

MIGRATE = Migrate(app, db)
db.init_app(app)
CORS(app)
setup_admin(app)
jwt = JWTManager(app)
bcrypt = Bcrypt(app)


@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code


@app.route('/')
def sitemap():
    return generate_sitemap(app)


@app.post('/api/auth/register')
def register():
    data = request.get_json() or {}
    email = data.get('email')
    name = data.get('name')
    password = data.get('password')
    if not email or not name or not password:
        raise APIException('Missing required fields', 400)
    if User.query.filter_by(email=email).first():
        raise APIException('User already exists', 409)
    password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
    user = User(email=email, name=name, password_hash=password_hash)
    db.session.add(user)
    db.session.commit()
    token = create_access_token(identity=user.id)
    return jsonify({'user': user.serialize(), 'token': token}), 201


@app.post('/api/auth/login')
def login():
    data = request.get_json() or {}
    email = data.get('email')
    password = data.get('password')
    if not email or not password:
        raise APIException('Missing email or password', 400)
    user = User.query.filter_by(email=email).first()
    if not user or not bcrypt.check_password_hash(user.password_hash, password):
        raise APIException('Invalid credentials', 401)
    token = create_access_token(identity=user.id)
    return jsonify({'user': user.serialize(), 'token': token})


@app.get('/api/auth/me')
@jwt_required()
def me():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        raise APIException('User not found', 404)
    return jsonify({'user': user.serialize()})


@app.route('/user', methods=['GET'])
def handle_hello():
    return jsonify({"msg": "Hello, this is your GET /user response "}), 200


if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3000))
    app.run(host='0.0.0.0', port=PORT, debug=False)

