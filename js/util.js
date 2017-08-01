;

if (!window.UTIL) window.UTIL = new Object()

;(function(){
    'use strict';    
    let ID = 0;
    {
        UTIL.COMM = class {
            constructor(id) {
                this.id = ID++;
                this.receivers = new Object();
                this.disconnected = []
                this.events = {
                    incoming: []
                }
            }
            
            on(event, callback, receiver) {
                if (event in this.events) {
                    this.events[event].push(callback.bind(receiver))
                } 
            }
            
            trigger(event, ...params) {
                if (event === 'incoming') {
                    for (let i=0 ; i<this.events.incoming.length ; i++)
                        this.events.incoming[i](...params)
                } else if (event === 'outgoing') {
                    for (let receiver in this.receivers) {
                        this.receivers[receiver].trigger('incoming', ...params)
                    }
                }
            }
            
            connect(otherCOMM) {
                console.log('disconnected COMMS:', this.disconnected)
                this.receivers[otherCOMM.id] = otherCOMM
                otherCOMM.receivers[this.id] = this
            }
            
            disconnect(otherCOMM) {
                this.disconnected.push(otherCOMM)
                console.log('disconnecting from ', otherCOMM.id)
                delete this.receivers[otherCOMM.id]
                delete otherCOMM.receivers[this.id]
            }
            
        }
    }
})()