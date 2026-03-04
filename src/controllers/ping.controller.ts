import {get, response} from '@loopback/rest';

export class PingController {
  @get('/ping')
  @response(200, {
    description: 'Health check',
    content: {'application/json': {schema: {type: 'object'}}},
  })
  ping(): object {
    return {status: 'ok', timestamp: new Date().toISOString()};
  }
}
