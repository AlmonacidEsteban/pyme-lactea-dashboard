#!/usr/bin/env python3
import requests
import json

def test_register():
    url = "http://127.0.0.1:8000/api/auth/register/"
    
    data = {
        "username": "testuser9",
        "email": "test9@example.com",
        "password": "testpassword123",
        "password_confirm": "testpassword123",
        "first_name": "Test",
        "last_name": "User"
    }
    
    headers = {
        "Content-Type": "application/json"
    }
    
    print(f"🚀 Enviando petición de registro...")
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
    test_register()