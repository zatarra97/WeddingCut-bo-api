import {inject} from '@loopback/core';
import {
  FindRoute,
  InvokeMethod,
  ParseParams,
  Reject,
  RequestContext,
  RestBindings,
  Send,
  SequenceHandler,
} from '@loopback/rest';

const SequenceActions = RestBindings.SequenceActions;

export class MySequence implements SequenceHandler {
  constructor(
    @inject(SequenceActions.FIND_ROUTE) protected findRoute: FindRoute,
    @inject(SequenceActions.PARSE_PARAMS) protected parseParams: ParseParams,
    @inject(SequenceActions.INVOKE_METHOD) protected invoke: InvokeMethod,
    @inject(SequenceActions.SEND) public send: Send,
    @inject(SequenceActions.REJECT) public reject: Reject,
  ) { }

  async handle(context: RequestContext) {
    const {request, response} = context;

    // Aggiungi gli header CORS alla risposta
    response.setHeader('Access-Control-Allow-Origin', process.env.CORS_FRONTEND || '');
    response.setHeader('Access-Control-Allow-Credentials', 'true');
    response.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');

    // Gestisci le richieste OPTIONS (preflight)
    if (request.method === 'OPTIONS') {
      response.statusCode = 204;
      response.end();
      return;
    }

    const route = this.findRoute(request);
    const args = await this.parseParams(request, route);
    const result = await this.invoke(route, args);

    this.send(response, result);
  }
}
