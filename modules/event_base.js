/**
 * Created by xzj on 2016/6/3 0003.
 */
var events=require('events');
var util=require('util');

function _base(){
    this.emitter=new events.EventEmitter(this);
};

util.inherits(_base,events.EventEmitter); //继承

_base.prototype.onEvent=function(eventName,callback){
    this.emitter.on(eventName,callback);
}

_base.prototype.emitEvent=function(eventName,arg){
    this.emitter.emit(eventName,arg);
}


module.exports=_base;