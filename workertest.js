/**
 * Created by xinquanzhou on 11/26/14.
 */
//var worker = new Worker("js/readData.js");
//
//worker.addEventListener('message',function(e){
//    console.log('Worker said:', e.data);
//
//},false);
//
//worker.postMessage("Hello world");


self.addEventListener('message',function(e){
    var file = e.data;
    console.log(e.data);
    d3.csv(file,function(error,data){
        data.forEach(function(d){
//            console.log(d);
            self.postMessage(d['steps']);
        })

    })
//    self.postMessage("worker say: " + e.data.msg);

}, false);

