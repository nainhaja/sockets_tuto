import { Logger } from '@nestjs/common';
import { OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({namespace: '/chat'})
export class ChatGateway implements OnGatewayInit {

  @WebSocketServer() wss: Server;

  private logger: Logger = new Logger('ChatGateway');
  
  afterInit(server: any) {
    this.logger.log('Initialized');
  }


  @SubscribeMessage('chatToServer')
  handleMessage(client: Socket, message: {sender: string,  message: string, room:string}){
    this.wss.to(message.room).emit('chatToClient', message);
    // this.logger.log('Hana ' + message.room + message.sender);
  }
  
  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, room: string)
  {
    client.join(room);
    client.emit('joinedRoom', room);
  }


  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(client: Socket, room: string)
  {
    client.leave(room);
    client.emit('leftRoom', room);
  }
}

