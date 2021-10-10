import json
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

cred = credentials.Certificate("./speeddev_creds.json")
firebase_admin.initialize_app(cred)

db = firestore.client()

with open ('./Codes/codes_java_sorts.json', 'r') as file:
    snippets = json.load(file)
    for snippet in snippets:
        title = snippet['title'] + str(snippet['id'])
        db.collection(u'snippets').document(title).set(snippet)
        print(snippet)