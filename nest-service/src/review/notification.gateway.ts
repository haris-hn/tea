import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedUsers: Map<string, string> = new Map(); // userId -> socketId

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      this.connectedUsers.set(userId, client.id);
      console.log(`User connected: ${userId} (${client.id})`);
    }
  }

  handleDisconnect(client: Socket) {
    for (const [userId, socketId] of this.connectedUsers.entries()) {
      if (socketId === client.id) {
        this.connectedUsers.delete(userId);
        console.log(`User disconnected: ${userId}`);
        break;
      }
    }
  }

  // Broadcast to all users
  notifyNewReview(review: any) {
    this.server.emit('new_review', {
      message: `A new review was added for ${review.product}`,
      review,
    });
  }

  // Direct to review owner
  notifyNewReply(ownerId: string, reply: any, reviewId: string) {
    const socketId = this.connectedUsers.get(ownerId);
    if (socketId) {
      this.server.to(socketId).emit('new_reply', {
        message: `Someone replied to your review!`,
        reply,
        reviewId,
      });
    }
  }

  // Direct to review author
  notifyNewLike(authorId: string, likerName: string, reviewId: string) {
    const socketId = this.connectedUsers.get(authorId);
    if (socketId) {
      this.server.to(socketId).emit('new_like', {
        message: `${likerName} liked your review!`,
        reviewId,
      });
    }
  }
}
