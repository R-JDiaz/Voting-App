import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket!: Socket;
  private isConnected = false;

  constructor() {}

  connect(): void {
    if (!this.socket) {

      this.socket = io(environment.socketUrl || 'http://localhost:3000', {
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 1000
      });

      this.socket.on('connect', () => {
        console.log('✅ Socket connected:', this.socket.id);
        this.isConnected = true;
      });

      this.socket.on('disconnect', () => {
        console.log('❌ Socket disconnected');
        this.isConnected = false;
      });

      this.socket.on('connect_error', (err) => {
        console.error('⚠️ Connection error:', err.message);
      });
    }
  }

  joinElectionRoom(electionId: number): void {
    this.connect();

    // Wait until connected before emitting
    if (this.socket.connected) {
      this.socket.emit('joinElection', electionId);
    } else {
      this.socket.once('connect', () => {
        this.socket.emit('joinElection', electionId);
      });
    }
  }

  leaveElectionRoom(electionId: number): void {
    if (this.socket?.connected) {
      this.socket.emit('leaveElection', electionId);
    }
  }

  listen<T>(eventName: string): Observable<T> {
    return new Observable<T>((subscriber) => {
      this.connect();

      const handler = (data: T) => subscriber.next(data);
      this.socket.on(eventName, handler);

      return () => {
        this.socket.off(eventName, handler);
      };
    });
  }

  onPositionUpdate(): Observable<any> {
    return this.listen<any>('electionUpdate');
  }

  onCandidateUpdate(): Observable<any> {
    return this.listen<any>('electionUpdate');
  }

  emit(eventName: string, data?: any): void {
    this.connect();

    if (this.socket.connected) {
      this.socket.emit(eventName, data);
    } else {
      this.socket.once('connect', () => {
        this.socket.emit(eventName, data);
      });
    }
  }

  disconnect(): void {
    if (this.socket) this.socket.disconnect();
  }
}