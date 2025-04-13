import {AuthenticateFn, AuthenticationBindings} from '@loopback/authentication';
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
    @inject(AuthenticationBindings.AUTH_ACTION)
    protected authenticateRequest: AuthenticateFn,
  ) {}

  async handle(context: RequestContext) {
    try {
      const {request, response} = context;

      // Aggiungi gli header CORS alla risposta
      response.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
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

      // Verifica se la rotta è pubblica (inizia con /public)
      const isPublicRoute = request.path.startsWith('/public');

      if (!isPublicRoute) {
        console.log('[DEBUG] Rotta protetta, verifico autenticazione:', request.path);
        await this.authenticateRequest(request);
      } else {
        console.log('[DEBUG] Rotta pubblica, nessuna autenticazione richiesta:', request.path);
      }

      const args = await this.parseParams(request, route);
      const result = await this.invoke(route, args);

      this.send(response, result);
    } catch (err) {
      // Log dell'errore per debug
      console.error('[ERROR] Sequence error:', err);
      this.reject(context, err);
    }
  }
}
