;

if (!window.UTIL) window.UTIL = new Object()

;(function(){
    'use strict';    
    {
        
        UTIL.COMM = class {
            constructor(id) {
                this.id = id
                this.receivers = new Object();
                this.events = {
                    incoming: []
                }
            }
            
            on(event, callback, receiver) {
                if (event in this.events) {
                    for (let i=0 ; i<this.events[event].length ; i++) {
                        if (this.events[event][i].callback === callback) {
                            this.events[event][i] = {
                                callback: callback,
                                receiver: receiver
                            }
                            return;
                        }
                    }
                    this.events[event].push({
                        callback: callback,
                        receiver: receiver
                    })
                } 
            }
            
            trigger(event, ...params) {
                if (event === 'incoming') {
                    for (let i=0 ; i<this.events.incoming.length ; i++)
                        this.events.incoming[i].callback.call(this.events.incoming[i].receiver, ...params)
                } else if (event === 'outgoing') {
                    for (let receiver in this.receivers) {
                        this.receivers[receiver].trigger('incoming', ...params)
                    }
                }
            }
            
            connect(otherCOMM) {
                this.receivers[otherCOMM.id] = otherCOMM
                otherCOMM.receivers[this.id] = this
            }
            
            disconnect(otherCOMM) {
                delete this.receivers[otherCOMM.id]
                delete otherCOMM.receivers[this.id]
            }
            
        }
    }
})()