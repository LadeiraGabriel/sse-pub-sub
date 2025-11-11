import { Injectable, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class PubSubService implements OnModuleInit {
  private publisherRedis: Redis;
  private subscriberRedis: Redis;
  onModuleInit() {
    const configRedis = {
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
      password: process.env.REDIS_PASSWORD,
    };

    this.publisherRedis = new Redis(configRedis);
    this.subscriberRedis = new Redis(configRedis);
  }

  publish(channel: string, data: any) {
    this.publisherRedis.publish(channel, JSON.stringify(data));
  }

  subscribe(channel: string, callback: (message: string) => void) {
    this.subscriberRedis.subscribe(channel, (err) => {
      if (err) {
        console.error(`Error subscribing to ${channel}:`, err);
        return;
      }
      console.log(`Subscribed to ${channel}`);
    });

    this.subscriberRedis.on('message', (ch, message) => {
      if (ch === channel) {
        callback(message);
      }
    });
  }

  unsubscribe(channel: string) {
    this.subscriberRedis.unsubscribe(channel);
  }

  onModuleDestroy() {
    this.publisherRedis.disconnect();
    this.subscriberRedis.disconnect();
  }
}
