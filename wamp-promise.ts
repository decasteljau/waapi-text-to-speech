import * as autobahn from 'autobahn';

interface ISubscriptions{
    [topic: string]: autobahn.ISubscription[]
};

export class Session {

    session:autobahn.Session;
    connection:autobahn.Connection;
     
    subscriptions: ISubscriptions = {};

    constructor(session:autobahn.Session, connection:autobahn.Connection){
        this.session = session;
        this.connection = connection;
    }

    /** call a function using wamp RPC */
    call(uri: string, args: any, options?: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.session.call(uri, [], args, options).then(
                function (res) {
                    resolve(res ? (<any>res).kwargs: null);
                },
                function (error) {
                    reject(error);
                }
            );
        });
    }

    /** subscribe to topic */
    subscribe(topic: string, subscribeHandler: autobahn.SubscribeHandler, options: any): Promise<autobahn.ISubscription> {
        return new Promise((resolve, reject) => {
            var self = this;
            this.session.subscribe(topic, subscribeHandler, options).then(
                function (res) {
                    resolve(res);
                },
                function (error) {
                    reject(error);
                }
            );
        });
    }

    /** unsubscribe to topic */
    unsubscribe(subscription: autobahn.ISubscription): Promise<any> {
        return new Promise((resolve, reject) => {
            this.session.unsubscribe(subscription).then(
                function (res) {
                    resolve(null);
                },
                function (error) {
                    reject(error);
                }
            );
        });
    }

    disconnect() {
        return new Promise((resolve, reject) => {
            if (this.session.isOpen) {
                this.session.onleave = function (reason, details) {
                    resolve();
                };

                this.connection.close();
                
                this.connection = null;
                this.session = null;
            } else {
                reject();
            }
        });
    }
}

export function connect(host: string): Promise<Session> {
    return new Promise((resolve, reject) => {
        var connection = new autobahn.Connection(
            { 
                url: host, 
                realm: 'realm1',
                protocols: ['wamp.2.json'],
            });

        connection.onclose = function (reason, details): boolean {
            reject(new Error(`Session closed: ${reason}`));
            return true;
        };
        connection.onopen = function (session) {
            connection.onclose = null;
            resolve(new Session(session, connection));
        };

        connection.open();
    });
}
