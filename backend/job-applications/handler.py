import json
import boto3
import uuid
from datetime import datetime, timezone
from decimal import Decimal
from boto3.dynamodb.conditions import Key

dynamodb = boto3.resource('dynamodb', region_name='ap-south-1')
table = dynamodb.Table('dronetv-job-applications')
s3 = boto3.client('s3', region_name='ap-south-1')
RESUME_BUCKET = 'dronetv-job-applications-store'

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
}

VALID_STATUSES = {'Applied', 'Shortlisted', 'Interviewing', 'Hired', 'Rejected'}


def resp(status, body):
    return {
        'statusCode': status,
        'headers': CORS,
        'body': json.dumps(body, default=str),
    }


def _clean(item):
    if isinstance(item, dict):
        return {k: _clean(v) for k, v in item.items()}
    if isinstance(item, list):
        return [_clean(v) for v in item]
    if isinstance(item, Decimal):
        return int(item) if item % 1 == 0 else float(item)
    return item


def handler(event, context):
    method = event.get('httpMethod', 'GET')
    params = event.get('queryStringParameters') or {}
    path = event.get('path', '')

    if method == 'OPTIONS':
        return resp(200, {})

    if path.endswith('/upload-url') and method == 'POST':
        return handle_upload_url(event)

    if path.endswith('/resume-url') and method == 'GET':
        return handle_resume_url(params)

    if method == 'GET':
        job_id = params.get('jobId')
        application_id = params.get('id')

        if job_id and application_id:
            result = table.get_item(Key={'jobId': job_id, 'applicationId': application_id})
            item = result.get('Item')
            if not item:
                return resp(404, {'error': 'Not found'})
            return resp(200, {'item': _clean(item)})

        if job_id:
            result = table.query(KeyConditionExpression=Key('jobId').eq(job_id))
            items = [_clean(i) for i in result.get('Items', [])]
            items.sort(key=lambda x: x.get('appliedAt') or '', reverse=True)
            return resp(200, {'items': items, 'count': len(items)})

        return resp(400, {'error': 'jobId is required'})

    if method == 'POST':
        body = json.loads(event.get('body') or '{}')
        job_id = body.get('jobId')
        if not job_id:
            return resp(400, {'error': 'jobId is required'})

        now = datetime.now(timezone.utc).isoformat()
        item = {
            'jobId': job_id,
            'applicationId': str(uuid.uuid4()),
            'jobTitle': body.get('jobTitle', ''),
            'company': body.get('company', ''),
            'fullName': body.get('fullName', ''),
            'email': body.get('email', ''),
            'phone': body.get('phone', ''),
            'location': body.get('location', ''),
            'currentCompany': body.get('currentCompany', ''),
            'currentRole': body.get('currentRole', ''),
            'education': body.get('education', ''),
            'experienceYears': body.get('experienceYears', ''),
            'expectedSalary': body.get('expectedSalary', ''),
            'noticePeriod': body.get('noticePeriod', ''),
            'dateOfBirth': body.get('dateOfBirth', ''),
            'gender': body.get('gender', ''),
            'professionalSummary': body.get('professionalSummary', ''),
            'skills': body.get('skills', []),
            'experienceHighlights': body.get('experienceHighlights', []),
            'projects': body.get('projects', []),
            'documents': body.get('documents', []),
            'resumeKey': body.get('resumeKey', ''),
            'status': 'Applied',
            'activity': [{'action': 'Applied', 'timestamp': now, 'note': ''}],
            'appliedAt': now,
            'updatedAt': now,
        }
        table.put_item(Item=item)
        return resp(201, {'message': 'Application submitted', 'item': item})

    if method == 'PATCH':
        body = json.loads(event.get('body') or '{}')
        job_id = body.get('jobId')
        application_id = body.get('applicationId')
        if not job_id or not application_id:
            return resp(400, {'error': 'jobId and applicationId required'})

        existing = table.get_item(Key={'jobId': job_id, 'applicationId': application_id})
        if not existing.get('Item'):
            return resp(404, {'error': 'Not found'})

        now = datetime.now(timezone.utc).isoformat()
        updates = {k: v for k, v in body.items() if k not in ('jobId', 'applicationId', 'appliedAt', 'activity')}
        updates['updatedAt'] = now

        new_status = body.get('status')
        activity = list(existing['Item'].get('activity', []))
        if new_status and new_status in VALID_STATUSES and new_status != existing['Item'].get('status'):
            activity.append({'action': new_status, 'timestamp': now, 'note': body.get('note', '')})
        if body.get('note') and not new_status:
            activity.append({'action': 'Note added', 'timestamp': now, 'note': body.get('note', '')})
        updates['activity'] = activity

        expr_parts = []
        expr_vals = {}
        expr_names = {}
        for i, (k, v) in enumerate(updates.items()):
            safe_key = f'#f{i}'
            val_key = f':v{i}'
            expr_names[safe_key] = k
            expr_vals[val_key] = v
            expr_parts.append(f'{safe_key} = {val_key}')

        table.update_item(
            Key={'jobId': job_id, 'applicationId': application_id},
            UpdateExpression='SET ' + ', '.join(expr_parts),
            ExpressionAttributeNames=expr_names,
            ExpressionAttributeValues=expr_vals,
        )
        return resp(200, {'message': 'Updated'})

    if method == 'DELETE':
        job_id = params.get('jobId')
        application_id = params.get('id')
        if not job_id or not application_id:
            return resp(400, {'error': 'jobId and id required'})
        table.delete_item(Key={'jobId': job_id, 'applicationId': application_id})
        return resp(200, {'message': 'Deleted'})

    return resp(405, {'error': 'Method not allowed'})


def handle_upload_url(event):
    body = json.loads(event.get('body') or '{}')
    file_name = body.get('fileName', 'resume.pdf')
    content_type = body.get('contentType', 'application/pdf')
    key = f"resumes/{uuid.uuid4()}-{file_name}"

    url = s3.generate_presigned_url(
        'put_object',
        Params={'Bucket': RESUME_BUCKET, 'Key': key, 'ContentType': content_type},
        ExpiresIn=300,
    )
    return resp(200, {'uploadUrl': url, 'key': key})


def handle_resume_url(params):
    key = params.get('key')
    if not key:
        return resp(400, {'error': 'key is required'})
    url = s3.generate_presigned_url(
        'get_object',
        Params={'Bucket': RESUME_BUCKET, 'Key': key},
        ExpiresIn=600,
    )
    return resp(200, {'url': url})
