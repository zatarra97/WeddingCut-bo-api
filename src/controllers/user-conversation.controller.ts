import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,
  HttpErrors,
  param,
  post,
  requestBody,
  response,
} from '@loopback/rest';
import {SecurityBindings, UserProfile} from '@loopback/security';
import {randomUUID} from 'crypto';
import {Conversation, Message} from '../models';
import {ConversationRepository, MessageRepository} from '../repositories';
import {requireUser} from '../utils/authorization';

interface ConversationWithUnread extends Partial<Conversation> {
  unreadCount: number;
}

@authenticate('cognito')
export class UserConversationController {
  constructor(
    @repository(ConversationRepository)
    public conversationRepository: ConversationRepository,
    @repository(MessageRepository)
    public messageRepository: MessageRepository,
  ) {}

  // ── POST /user/conversations ─────────────────────────────────────────────
  @post('/user/conversations')
  @response(201, {
    description: 'Conversazione creata',
    content: {'application/json': {schema: getModelSchemaRef(Conversation)}},
  })
  async create(
    @inject(SecurityBindings.USER) currentUser: UserProfile,
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['subject'],
            properties: {
              subject: {type: 'string'},
              orderId: {type: 'string'},
            },
          },
        },
      },
    })
    body: {subject: string; orderId?: string},
  ): Promise<Conversation> {
    requireUser(currentUser);
    const email: string = (currentUser as any).email ?? '';
    return this.conversationRepository.create({
      publicId: randomUUID(),
      userEmail: email,
      subject: body.subject.trim(),
      orderId: body.orderId ?? undefined,
      status: 'open',
      lastMessageAt: new Date(),
    });
  }

  // ── GET /user/conversations ──────────────────────────────────────────────
  @get('/user/conversations')
  @response(200, {
    description: 'Lista conversazioni con conteggio messaggi non letti',
    content: {'application/json': {schema: {type: 'array', items: {type: 'object'}}}},
  })
  async findMyConversations(
    @inject(SecurityBindings.USER) currentUser: UserProfile,
  ): Promise<ConversationWithUnread[]> {
    requireUser(currentUser);
    const email: string = (currentUser as any).email ?? '';
    const conversations = await this.conversationRepository.find({
      where: {userEmail: email},
      order: ['lastMessageAt DESC'],
    });

    return Promise.all(
      conversations.map(async (conv) => {
        const unread = await this.messageRepository.count({
          conversationId: conv.id!,
          senderRole: 'admin',
          readAt: {eq: null} as any,
        });
        return {...conv, unreadCount: unread.count};
      }),
    );
  }

  // ── GET /user/conversations/:publicId/messages ───────────────────────────
  @get('/user/conversations/{publicId}/messages')
  @response(200, {
    description: 'Messaggi della conversazione (segna i messaggi admin come letti)',
    content: {'application/json': {schema: {type: 'array', items: getModelSchemaRef(Message)}}},
  })
  async getMessages(
    @inject(SecurityBindings.USER) currentUser: UserProfile,
    @param.path.string('publicId') publicId: string,
  ): Promise<Message[]> {
    requireUser(currentUser);
    const email: string = (currentUser as any).email ?? '';
    const conv = await this.resolveConversation(publicId, email);

    // Segna come letti i messaggi dell'admin non ancora letti
    await this.messageRepository.updateAll(
      {readAt: new Date()},
      {conversationId: conv.id!, senderRole: 'admin', readAt: {eq: null} as any},
    );

    return this.messageRepository.find({
      where: {conversationId: conv.id!},
      order: ['createdAt ASC'],
    });
  }

  // ── POST /user/conversations/:publicId/messages ──────────────────────────
  @post('/user/conversations/{publicId}/messages')
  @response(201, {
    description: 'Messaggio inviato',
    content: {'application/json': {schema: getModelSchemaRef(Message)}},
  })
  async sendMessage(
    @inject(SecurityBindings.USER) currentUser: UserProfile,
    @param.path.string('publicId') publicId: string,
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['content'],
            properties: {content: {type: 'string'}},
          },
        },
      },
    })
    body: {content: string},
  ): Promise<Message> {
    requireUser(currentUser);
    const email: string = (currentUser as any).email ?? '';
    const conv = await this.resolveConversation(publicId, email);

    if (conv.status === 'closed') {
      throw new HttpErrors.UnprocessableEntity(
        'La conversazione è chiusa. Apri una nuova conversazione.',
      );
    }

    const msg = await this.messageRepository.create({
      publicId: randomUUID(),
      conversationId: conv.id!,
      senderRole: 'user',
      senderEmail: email,
      content: body.content.trim(),
    });

    await this.conversationRepository.updateById(conv.id!, {
      lastMessageAt: new Date(),
      updatedAt: new Date(),
    });

    return msg;
  }

  // ── Helper ────────────────────────────────────────────────────────────────
  private async resolveConversation(
    publicId: string,
    email: string,
  ): Promise<Conversation> {
    const [conv] = await this.conversationRepository.find({
      where: {publicId},
      limit: 1,
    });
    if (!conv) throw new HttpErrors.NotFound('Conversazione non trovata.');
    if (conv.userEmail !== email)
      throw new HttpErrors.Forbidden('Accesso negato.');
    return conv;
  }
}
