import {inject} from '@loopback/core';
import {juggler} from '@loopback/repository';
import {
  get,
  Request,
  response,
  ResponseObject,
  RestBindings,
} from '@loopback/rest';

/**
 * OpenAPI response for ping() as JSON
 */
const PING_RESPONSE_JSON: ResponseObject = {
  description: 'Ping Response',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        title: 'PingResponse',
        properties: {
          greeting: {type: 'string'},
          date: {type: 'string'},
          url: {type: 'string'},
          headers: {
            type: 'object',
            properties: {
              'Content-Type': {type: 'string'},
            },
            additionalProperties: true,
          },
          dbConnectionStatus: {type: 'string'},
        },
      },
    },
  },
};

/**
 * A simple controller to bounce back http requests
 */
export class PingController {
  constructor(
    @inject(RestBindings.Http.REQUEST) private req: Request,
    @inject('datasources.mysql') private dataSource: juggler.DataSource,
  ) { }

  // Map to `GET /ping`
  @get('/ping')
  @response(200, PING_RESPONSE_JSON)
  async ping(): Promise<object> {
    let dbConnectionStatus: string;
    try {
      // Esegui una semplice query per verificare la connessione
      await this.dataSource.execute('SELECT 1');
      dbConnectionStatus = 'connected';
    } catch (err) {
      dbConnectionStatus = 'disconnected';
    }

    // Reply with a greeting, the current time, the url, and request headers
    return {
      greeting: 'Hello from LoopBack',
      date: new Date().toISOString(),
      url: this.req.url,
      headers: Object.assign({}, this.req.headers),
      dbConnectionStatus: dbConnectionStatus,
    };
  }
}
