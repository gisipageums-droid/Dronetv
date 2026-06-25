import json
import os
import urllib.request
import urllib.error

SUREPASS_TOKEN = os.environ['SUREPASS_TOKEN']

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST,OPTIONS',
}

ENDPOINTS = {
    'gstin':          'https://kyc-api.surepass.io/api/v1/corporate/gstin-advanced',
    'cin':            'https://kyc-api.surepass.io/api/v1/corporate/company-details',
    'digilocker-init':'https://kyc-api.surepass.app/api/v1/digilocker/initialize',
}


def resp(status, body):
    return {'statusCode': status, 'headers': CORS, 'body': json.dumps(body)}


def surepass_post(url, payload):
    data = json.dumps(payload).encode()
    req = urllib.request.Request(
        url, data=data,
        headers={
            'Authorization': f'Bearer {SUREPASS_TOKEN}',
            'Content-Type': 'application/json',
        },
        method='POST',
    )
    try:
        with urllib.request.urlopen(req, timeout=25) as r:
            return json.loads(r.read()), r.status
    except urllib.error.HTTPError as e:
        return json.loads(e.read()), e.code
    except Exception as e:
        return {'success': False, 'message': str(e)}, 500


def surepass_get(url):
    req = urllib.request.Request(
        url,
        headers={'Authorization': f'Bearer {SUREPASS_TOKEN}'},
        method='GET',
    )
    try:
        with urllib.request.urlopen(req, timeout=25) as r:
            return json.loads(r.read()), r.status
    except urllib.error.HTTPError as e:
        return json.loads(e.read()), e.code
    except Exception as e:
        return {'success': False, 'message': str(e)}, 500


def handler(event, context):
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    try:
        body = json.loads(event.get('body') or '{}')
    except Exception:
        return resp(400, {'success': False, 'message': 'Invalid JSON body'})

    action = body.get('action', '')

    if action == 'gstin':
        id_number = body.get('id_number', '').strip()
        if not id_number:
            return resp(400, {'success': False, 'message': 'id_number required'})
        data, status = surepass_post(ENDPOINTS['gstin'], {'id_number': id_number})
        return resp(status, data)

    if action == 'cin':
        id_number = body.get('id_number', '').strip()
        if not id_number:
            return resp(400, {'success': False, 'message': 'id_number required'})
        data, status = surepass_post(ENDPOINTS['cin'], {'id_number': id_number})
        return resp(status, data)

    if action == 'digilocker-init':
        data, status = surepass_post(ENDPOINTS['digilocker-init'], {'data': {'signup_flow': True}})
        return resp(status, data)

    if action == 'digilocker-poll':
        client_id = body.get('client_id', '').strip()
        if not client_id:
            return resp(400, {'success': False, 'message': 'client_id required'})
        url = f'https://kyc-api.surepass.app/api/v1/digilocker/download-aadhaar/{client_id}'
        data, status = surepass_get(url)
        return resp(status, data)

    return resp(400, {'success': False, 'message': f'Unknown action: {action}'})
