import json
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

cred = credentials.Certificate("./speeddev_creds.json")
firebase_admin.initialize_app(cred)

db = firestore.client()

for file in ['./Codes/codes_java_sorts.json', './Codes/codes_java_math.json']:
  with open (file, 'r') as file:
      snippets = json.load(file)
      for snippet in snippets:
          del snippet['id']
          db.collection(u'snippets').add(snippet)
          print(snippet)