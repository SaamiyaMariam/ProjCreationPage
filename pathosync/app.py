from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from flask_pymongo import PyMongo
from bson.json_util import dumps
from bson.objectid import ObjectId
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app) 

# Configure MongoDB connection
app.config["MONGO_URI"] = "mongodb://localhost:27017/pathosyncDB"  # Replace with your MongoDB URI
app.config['UPLOAD_FOLDER'] = 'uploads'

if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])

mongo = PyMongo(app)

# Checking if the MongoDB connection was successful
if mongo.db is None:
    raise Exception("MongoDB connection failed. Please check the MongoDB URI and server status.")

projects_collection = mongo.db.projects
images_collection = mongo.db.images

@app.route('/projects/create', methods=['POST'])
def create_project():
    try:
        data = request.json
        print("Received data:", data)  # Log request data
        if not data:
            raise ValueError("No data provided")

        new_project = {
            'name': data['name'],
            'numClasses': data['numClasses'],
            'datasetType': data['datasetType'],
            'classNames': data['classNames']
        }
        result = projects_collection.insert_one(new_project)  # Add the new project to MongoDB
        new_project['_id'] = str(result.inserted_id)

        return jsonify({'message': 'Project created successfully', 'project': new_project}), 201
    except ValueError as ve:
        print("ValueError:", str(ve))  # Log ValueError
        return jsonify({'error': str(ve)}), 400
    except Exception as e:
        print("Error:", str(e))  # Log any other errors
        return jsonify({'error': 'An error occurred while creating the project'}), 500

@app.route('/projects', methods=['GET'])
def get_projects():
    projects = list(projects_collection.find())
    for project in projects:
        project['_id'] = str(project['_id'])
        project['images'] = list(images_collection.find({'project_id': project['_id']}))
        for image in project['images']:
            image['_id'] = str(image['_id'])
    return jsonify(projects)

@app.route('/projects/<project_id>/upload', methods=['POST'])
def upload_image(project_id):
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file part'}), 400

        files = request.files.getlist('file')
        saved_files = []
        
        for file in files:
            if file.filename == '':
                return jsonify({'error': 'No selected file'}), 400
            
            filename = secure_filename(file.filename)
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(file_path)
            
            image_data = {
                '_id': str(ObjectId()),
                'filename': filename,
                'filepath': file_path
            }
            projects_collection.update_one(
                {'_id': ObjectId(project_id)},
                {'$push': {'images': image_data}}
            )
            saved_files.append(image_data)

        return jsonify({'message': 'Files uploaded successfully', 'images': saved_files}), 201
    except Exception as e:
        return jsonify({'error': 'An error occurred while uploading the file(s)'}), 500

    
@app.route('/uploads/<filename>', methods=['GET'])
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename) 

if __name__ == '__main__':
    app.run(debug=True)  # Run the Flask app in debug mode
