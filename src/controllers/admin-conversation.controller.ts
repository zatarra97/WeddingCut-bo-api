import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,
  HttpErrors,
  param,
  patch,
  post,
  requestBody,
  response,
} from '@loopback/rest';
import {SecurityBindings, UserProfile} from '@loopback/security';
import {randomUUID} from 'crypto';
import {Conversation, Message} from '../models';
import {ConversationRepository, MessageRepository} from '../repositories';
import {requireAdmin} from '../utils/authorization';

interface ConversationWithUnread extends Partial<Conversation> {
  unreadCount: number;
}

@authenticate('cognito')
export class AdminConversationController {
  constructor(
    @repository(ConversationRepository)
    public conversationRepository: ConversationRepository,
    @repository(MessageRepository)
    public messageRepository: MessageRepository,
  ) {}

  // ── GET /admin/conversations ─────────────────────────────────────────────
  @get('/admin/conversations')
  @response(200, {
    description: 'Tutte le conversazioni con conteggio messaggi non letti',
    content: {'application/json': {schema: {type: 'array', items: {type: 'object'}}}},
  })
  async findAll(
    @inject(SecurityBindings.USER) currentUser: UserProfile,
    @param.query.string('status') status?: string,
    @param.query.string('userEmail') userEmail?: string,
  ): Promise<ConversationWithUnread[]> {
    requireAdmin(currentUser);
    const where: any = {};
    if (status) where.status = status;
    if (userEmail) where.userEmail = {like: `%${userEmail}%`};

    const conversations = await this.conversationRepository.find({
      where,
      order: ['lastMessageAt DESC'],
    });

    return Promise.all(
      conversations.map(async (conv) => {
        const unread = await this.messageRepository.count({
          conversationId: conv.id!,
          senderRole: 'user',
          readAt: {eq: null} as any,
        });
        return {...conv, unreadCount: unread.count};
      }),
    );
  }

  // ── GET /admin/conversations/:publicId/messages ──────────────────────────
  @get('/admin/conversations/{publicId}/messages')
  @response(200, {
    description: 'Messaggi della conversazione (segna i messaggi utente come letti)',
    content: {'application/json': {schema: {type: 'array', items: getModelSchemaRef(Message)}}},
  })
  async getMessages(
    @inject(SecurityBindings.USER) currentUser: UserProfile,
    @param.path.string('publicId') publicId: string,
  ): Promise<Message[]> {
    requireAdmin(currentUser);
    const conv = await this.resolveConversation(publicId);

    // Segna come letti i messaggi dell'utente non ancora letti
    await this.messageRepository.updateAll(
      {readAt: new Date()},
      {conversationId: conv.id!, senderRole: 'user', readAt: {eq: null} as any},
    );

    return this.messageRepository.find({
      where: {conversationId: conv.id!},
      order: ['createdAt ASC'],
    });
  }

  // ── POST /admin/conversations/:publicId/messages ─────────────────────────
  @post('/admin/conversations/{publicId}/messages')
  @response(201, {
    description: 'Risposta inviata',
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
    requireAdmin(currentUser);
    const email: string = (currentUser as any).email ?? '';
    const conv = await this.resolveConversation(publicId);

    const msg = await this.messageRepository.create({
      publicId: randomUUID(),
      conversationId: conv.id!,
      senderRole: 'admin',
      senderEmail: email,
      content: body.content.trim(),
    });

    await this.conversationRepository.updateById(conv.id!, {
      lastMessageAt: new Date(),
      updatedAt: new Date(),
    });

    return msg;
  }

  // ── PATCH /admin/conversations/:publicId ─────────────────────────────────
  @patch('/admin/conversations/{publicId}')
  @response(204, {description: 'Conversazione aggiornata'})
  async updateStatus(
    @inject(SecurityBindings.USER) currentUser: UserProfile,
    @param.path.string('publicId') publicId: string,
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {status: {type: 'string', enum: ['open', 'closed']}},
          },
        },
      },
    })
    body: {status: 'open' | 'closed'},
  ): Promise<void> {
    requireAdmin(currentUser);
    const conv = await this.resolveConversation(publicId);
    await this.conversationRepository.updateById(conv.id!, {status: body.status});
  }

  // ── Helper ────────────────────────────────────────────────────────────────
  private async resolveConversation(publicId: string): Promise<Conversation> {
    const [conv] = await this.conversationRepository.find({
      where: {publicId},
      limit: 1,
    });
    if (!conv) throw new HttpErrors.NotFound('Conversazione non trovata.');
    return conv;
  }
}
