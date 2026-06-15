import json
import boto3
import uuid
from datetime import datetime, timezone
from decimal import Decimal
from boto3.dynamodb.conditions import Key

dynamodb = boto3.resource('dynamodb', region_name='ap-south-1')
table = dynamodb.Table('dronetv-media-content')

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
}

VALID_TYPES = {
    'news', 'magazine', 'video', 'impact-story',
    'market-intelligence', 'tech-trends', 'press-release', 'industry-report',
    'competition', 'webinar', 'meetup',
    'job', 'training', 'certification',
    'manufacturer', 'ai-company', 'event-organizer',
    'education-partner', 'industry-player',
}


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

    admin_path = '/admin' in path

    if method == 'GET':
        content_type = params.get('type')
        content_id = params.get('id')

        if content_type and content_id:
            result = table.get_item(Key={'contentType': content_type, 'contentId': content_id})
            item = result.get('Item')
            if not item:
                return resp(404, {'error': 'Not found'})
            return resp(200, {'item': _clean(item)})

        if content_type:
            result = table.query(KeyConditionExpression=Key('contentType').eq(content_type))
            items = [_clean(i) for i in result.get('Items', [])]
            if not admin_path:
                items = [i for i in items if i.get('isPublished')]
            items.sort(key=lambda x: x.get('publishedAt') or x.get('createdAt') or '', reverse=True)
            return resp(200, {'items': items, 'count': len(items)})

        all_types = list(VALID_TYPES)
        all_items = []
        for t in all_types:
            result = table.query(KeyConditionExpression=Key('contentType').eq(t))
            for i in result.get('Items', []):
                c = _clean(i)
                if admin_path or c.get('isPublished'):
                    all_items.append(c)
        all_items.sort(key=lambda x: x.get('createdAt') or '', reverse=True)
        return resp(200, {'items': all_items, 'count': len(all_items)})

    if method == 'POST':
        body = json.loads(event.get('body') or '{}')
        content_type = body.get('contentType')
        if not content_type or content_type not in VALID_TYPES:
            return resp(400, {'error': f'Invalid contentType. Must be one of: {", ".join(sorted(VALID_TYPES))}'})

        now = datetime.now(timezone.utc).isoformat()
        item = {
            'contentType': content_type,
            'contentId': str(uuid.uuid4()),
            'title': body.get('title', ''),
            'description': body.get('description', ''),
            'imageUrl': body.get('imageUrl', ''),
            'externalLink': body.get('externalLink', ''),
            'videoUrl': body.get('videoUrl', ''),
            'source': body.get('source', ''),
            'author': body.get('author', ''),
            'tags': body.get('tags', []),
            'category': body.get('category', ''),
            'location': body.get('location', ''),
            'date': body.get('date', ''),
            'price': body.get('price', ''),
            'salary': body.get('salary', ''),
            'company': body.get('company', ''),
            'platform': body.get('platform', ''),
            'readTime': body.get('readTime', ''),
            'isPublished': body.get('isPublished', False),
            'publishedAt': now if body.get('isPublished') else '',
            'createdAt': now,
            'updatedAt': now,
        }
        table.put_item(Item=item)
        return resp(201, {'message': 'Created', 'item': item})

    if method == 'PUT':
        body = json.loads(event.get('body') or '{}')
        content_type = body.get('contentType')
        content_id = body.get('contentId')
        if not content_type or not content_id:
            return resp(400, {'error': 'contentType and contentId required'})

        existing = table.get_item(Key={'contentType': content_type, 'contentId': content_id})
        if not existing.get('Item'):
            return resp(404, {'error': 'Not found'})

        now = datetime.now(timezone.utc).isoformat()
        updates = {k: v for k, v in body.items() if k not in ('contentType', 'contentId', 'createdAt')}
        updates['updatedAt'] = now
        if updates.get('isPublished') and not existing['Item'].get('publishedAt'):
            updates['publishedAt'] = now

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
            Key={'contentType': content_type, 'contentId': content_id},
            UpdateExpression='SET ' + ', '.join(expr_parts),
            ExpressionAttributeNames=expr_names,
            ExpressionAttributeValues=expr_vals,
        )
        return resp(200, {'message': 'Updated'})

    if method == 'DELETE':
        content_type = params.get('type')
        content_id = params.get('id')
        if not content_type or not content_id:
            return resp(400, {'error': 'type and id required'})
        table.delete_item(Key={'contentType': content_type, 'contentId': content_id})
        return resp(200, {'message': 'Deleted'})

    return resp(405, {'error': 'Method not allowed'})
