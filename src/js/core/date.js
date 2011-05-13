//depends: main.js

Date.apiParse = function(dateString){
    // var da = dateString.split(/[-T:]/);
    // return new Date(da[0], da[1]-1, da[2], da[3], da[4], da[5]);
    return new Date(dateString);
}

Date.since = function(date){
    if (!(date instanceof Date))
        date = Date.apiParse(date);
    if (!(date instanceof Date))
        hs.error('Date.since passed invalid date', date);
    return date.since();
}

Date.prototype.since = function(){
    var now = new Date(),
        date = this;

    if (date < now){
        if (date.getFullYear() < now.getFullYear()){
            return {'text': 'Years ago', 'num': now.getFullYear() - date.getFullYear()};
        }else{
            if (date.getMonth() < now.getMonth()){
                return {'text': 'Months ago',
                        'num': now.getMonth() - date.getMonth()};
            }else{
                if (date.getDate() < now.getDate()){
                    return {'text': 'Days ago',
                            'num': now.getDate() - date.getDate()};
                }else{
                    if (date.getHours() < now.getHours()){
                        return {'text': 'Hours ago',
                                'num': now.getHours() - date.getHours()};
                    }else{
                        if (date.getMinutes() < now.getMinutes()){
                            return {'text': 'Minutes ago',
                                    'num': now.getMinutes() - date.getMinutes()};
                        }else{
                            if (date.getSeconds() < now.getSeconds()){
                                return {'text': 'Seconds ago',
                                        'num': now.getSeconds() - date.getSeconds()};
                            }else{
                                return {'text': 'just now', 'num': 0};
                            }
                        }
                    }
                }
            }
        }
    }else{
        hs.error('Date.since only accepts dates from the past', date);
    };
}
