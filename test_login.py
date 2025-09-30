#!/usr/bin/env python3
import requests
import json

def test_login():
    url = "http://127.0.0.1:8000/api/auth/login/"
    
    data = {
        "identifier": "test8@example.com",  # Usando email
        "password": "testpassword123"
    }
    
    headers = {
        "Content-Type": "application/json"
    }
    
    print(f"🔐 Enviando petición de login...")
    print(f"URL: {url}")
    print(f"Datos: {json.dumps(data, indent=2)}")
    print(f"Headers: {headers}")
    
    try:
        response = requests.post(url, json=data, headers=headers)
        
        print(f"\n📊 Respuesta:")
        print(f"Status Code: {response.status_code}")
        print(f"Headers: {dict(response.headers)}")
        
        try:
            response_data = response.json()
            print(f"Body: {json.dumps(response_data, indent=2)}")
        except:
            print(f"Body (text): {response.text}")
            
    except Exception as e:
        print(f"❌ Error: {e}")

def test_login_with_username():
    url = "http://127.0.0.1:8000/api/auth/login/"
    
    data = {
        "identifier": "testuser8",  # Usando username
        "password": "testpassword123"
    }
    
    headers = {
        "Content-Type": "application/json"
    }
    
    print(f"\n🔐 Enviando petición de login con username...")
    print(f"URL: {url}")
    print(f"Datos: {json.dumps(data, indent=2)}")
    print(f"Headers: {headers}")
    
    try:
        response = requests.post(url, json=data, headers=headers)
        
        print(f"\n📊 Respuesta:")
        print(f"Status Code: {response.status_code}")
        print(f"Headers: {dict(response.headers)}")
        
        try:
            response_data = response.json()
            print(f"Body: {json.dumps(response_data, indent=2)}")
        except:
            print(f"Body (text): {response.text}")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_login()
    test_login_with_username()