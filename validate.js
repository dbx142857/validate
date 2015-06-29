if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
        var _=require('underscore');
    }
}
/*
���òο�:
var $scope={};
 $scope.formData = {
 a: '',
 b: '',
 c: '',
 d: '',
 e: [],
 f: '',
 g: ''
 };
 var obj = {

 a: {
 name: '�齱����',
 type: 'string',
 rules: bs.lenRule('�齱����')
 },
 b: {
 name: '�齱��ʼʱ��',
 type: 'date',
 format: 'y/m/d h:i:s'
 },
 c: {
 name: '�齱ʧЧʱ��',
 type: 'date',
 format: 'y/m/d h:i:s'
 },
 d: {
 type: 'int',
 name: '�������'
 },
 e: {
 type: 'array',
 name: 'ѡ����',
 rules: [
 [
 function (val) {
 return val.length > 0;
 },
 '��ѡ������һ�����'
 ]
 ]
 },
 f: {
 type: 'string',
 name: '�齱����',
 rules: [
 [
 function (val) {
 return ['1', '0'].indexOf(val) !== -1;
 },
 '�齱����δѡ����߷Ƿ�'
 ]
 ]
 },
 _additionalRules: [
 [
 function () {
 return new Date(this.c).getTime() - new Date(this.b).getTime() > 0;
 },
 '�齱����ʱ�䲻��С�ڿ�ʼʱ��Ŷ'
 ]
 ]
 };
 var handleValidateResult = function (result) {
 if (result.status === 'ERROR') {
 swal(result.err.join('\n'));
 locker.unlock();
 } else {
 var isUpdate = ms.isUpdate();
 var formData = $.getFormDataByMap(_.clone($scope.formData), {
 a: 'title',
 b: 'begin_time',
 c: 'expire_time',
 d: 'total',
 e: 'redIds',
 f: 'onoff',
 g: 'desc'
 });
 formData.begin_time=new Date(formData.begin_time).getTime();
 formData.expire_time=new Date(formData.expire_time).getTime();
 console.log('formData is:', formData);
 bs.http(ms.ajaxConfig[isUpdate === true ? 'saveUpdatedRedPkgActivity' : 'saveNewRedPkgActivity'], function (data) {
 location.href = ms.urlConfig.redPkgActivityList;
 }, 'post', formData).finally(function () {
 locker.unlock();
 });
 }
 }

 $.validate(obj, $scope.formData, handleValidateResult);
 */
(function(global){
    function validate(checkRules,formData,cb,skipClientValidate){


        if(skipClientValidate===true){
            cb({
                status:'OK',
                formData:formData
            });
            return false;
        }

        var _additionalRules= _.isUndefined(checkRules._additionalRules)?null:checkRules._additionalRules;
        if(_additionalRules!==null){
            delete checkRules._additionalRules;
            console.log('checkRules is:',checkRules);
        }
        var err=[];
        if(_.isUndefined(checkRules)){
            err.push('У�������Ϊ��');
        }else{
            if(!_.isObject(checkRules)){
                err.push('У����������һ��js����');
            }
        }
        if(_.isUndefined(formData)){
            err.push('�����ݲ���Ϊ��');
        }else{
            if(!_.isObject(formData)){
                err.push('�����ݱ�����һ��js����');
            }
        }
        var isDate=function(txtDate)
        {
            var currVal = txtDate;
            if(currVal == '')
                return false;

            var rxDatePattern = /^(\d{4})(\/|-)(\d{1,2})(\/|-)(\d{1,2})$/; //Declare Regex
            var dtArray = currVal.match(rxDatePattern); // is format OK?

            if (dtArray == null)
                return false;

            //Checks for mm/dd/yyyy format.
            dtMonth = dtArray[3];
            dtDay= dtArray[5];
            dtYear = dtArray[1];

            if (dtMonth < 1 || dtMonth > 12)
                return false;
            else if (dtDay < 1 || dtDay> 31)
                return false;
            else if ((dtMonth==4 || dtMonth==6 || dtMonth==9 || dtMonth==11) && dtDay ==31)
                return false;
            else if (dtMonth == 2)
            {
                var isleap = (dtYear % 4 == 0 && (dtYear % 100 != 0 || dtYear % 400 == 0));
                if (dtDay> 29 || (dtDay ==29 && !isleap))
                    return false;
            }
            return true;
        }
        var isDateTime=function(str,format){
            var reg=null;
            if(format==='y-m-d h:i:s'){
                reg = /^(\d+)-(\d{1,2})-(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/;
            }else if(format==='y/m/d h:i:s'){
                reg = /^(\d+)\/(\d{1,2})\/(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/;
            }else{
                return true;
            }
            if(reg!==null){

            }
            //var reg = /^(\d+)-(\d{1,2})-(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/;
            var r = str.match(reg);
            if(r==null)return false;
            r[2]=r[2]-1;
            var d= new Date(r[1], r[2],r[3], r[4],r[5], r[6]);
            if(d.getFullYear()!=r[1])return false;
            if(d.getMonth()!=r[2])return false;
            if(d.getDate()!=r[3])return false;
            if(d.getHours()!=r[4])return false;
            if(d.getMinutes()!=r[5])return false;
            if(d.getSeconds()!=r[6])return false;
            return true;
        }


        for(var ii in checkRules){
            var val=formData[ii],item=checkRules[ii];

            //console.log('!_.isUndefined(val)',!_.isUndefined(val))
            //console.log('(_.isObject(checkRules))',(_.isObject(checkRules)));
            //console.log('(_.isObject(item))',(_.isObject(item)));

            if(
                (_.isObject(checkRules))
                &&(_.isObject(item))
            ){
                if(!_.isUndefined(item.setVal)){
                    if(
                        (_.isFunction(item.setVal.set))
                        &&(_.isString(item.setVal.reference))
                    ){
                        var setVal=item.setVal;
                        if(_.isUndefined(setVal.reference)){
                            err.push('setVal�������һ��reference');
                            break;
                        }else{
                            var reference=setVal.reference;
                            if(!_.isString(reference)){
                                err.push('setVal�������һ��reference,��reference�������ַ�������');
                                break;
                            }else{
                                var isReferenceExist=function(){
                                    var result=false;
                                    for(var kkk in formData){
                                        if(kkk===reference){
                                            result=true;
                                            break;
                                        }
                                    }
                                    return result;
                                }
                                if(!isReferenceExist()){
                                    err.push('setVal�а�����reference--'+reference+'��������');
                                    break;
                                }
                            }
                        }
                        val=item.setVal.set.call(checkRules,formData[reference]);
                        formData[ii]=val;
                    }else{

                        err.push('setVal���������⣬����ϸ���');
                        break;
                    }
                }
            }else{
                err.push('��У���������������');
                break;
            }


        }

        if(err.length>0){
            if(!_.isUndefined(cb)){
                if(_.isFunction(cb)){
                    cb({
                        status:'ERROR',
                        err:err,
                        formData:formData
                    });
                }else{
                    err.push('����������������һ���ص�����');
                }

            }

            return false;
        }

        for(var i in checkRules){
            var val=formData[i],item=checkRules[i];
            if(_.isUndefined(val)){
                if(_.isUndefined(item.setVal)){
                    err.push('���в�����'+i+'��У����Ŀ');
                    break;
                }

            }
            if(!_.isObject(item)){
                err.push('У����������һ������')
            }else{
                if(_.isUndefined(item.name)){
                    if(_.isUndefined(item.showError)||(item.showError===true)){
                        err.push('kΪ'+i+'��У����Ŀȱ��name����');
                        break;
                    }

                }
                else if(_.isUndefined(item.type)){
                    err.push('kΪ'+i+'��У����Ŀȱ��type����');
                    break;
                }
            }
            //console.log('val item checkRules:',val,item,checkRules);
            if(!_.isUndefined(item.setVal)){
                if(!_.isObject(item.setVal)){
                    err.push('setVal������һ��object����');
                    break;
                }else{
                    var setVal=item.setVal;
                    if(_.isUndefined(setVal.reference)){
                        err.push('setVal�������һ��reference');
                        break;
                    }else{
                        var reference=setVal.reference;
                        if(!_.isString(reference)){
                            err.push('setVal�������һ��reference,��reference�������ַ�������');
                            break;
                        }else{
                            var isReferenceExist=function(){
                                var result=false;
                                for(var k in formData){
                                    if(k===reference){
                                        result=true;
                                        break;
                                    }
                                }
                                return result;
                            }
                            if(!isReferenceExist()){
                                err.push('setVal�а�����reference--'+reference+'��������');
                                break;
                            }else{

                                if(_.isUndefined(setVal.set)){
                                    err.push('setVal�������һ��set����');
                                    break;
                                }else{
                                    if(!_.isFunction(setVal.set)){
                                        err.push('setVal������set����������һ��function');
                                        break;
                                    }
                                    //else{
                                    //    val=item.setVal.set.call(checkRules,formData[reference]);
                                    //    formData[i]=val;
                                    //}
                                }
                            }
                        }
                    }
                }
            }

            var check_rule=function(){
                if(!_.isUndefined(item.rules)){
                    if(!_.isArray(item.rules)){
                        err.push('�����б����������');
                    }else{
                        for(var j in item.rules){
                            var rule=item.rules[j];
                            if(rule.length<2){
                                err.push('ÿһ��У������������һ��У�鷽����һ��������ʾ��Ϣ');
                            }else{
                                if(!_.isFunction(rule[0])){
                                    err.push('ÿһ��У�����ĵ�һ�������һ��function�ҷ���true����false');
                                }else{
                                    if(!_.isString(rule[1])){
                                        err.push('ÿһ�������ڶ��������һ���ַ������͵���ʾ��Ϣ');
                                    }else{
                                        //console.log('vallllllll',val)
                                        if(rule[0].call(formData,val)!==true){
                                            err.push(rule[1]);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }


            if(!_.isUndefined(val)){
                if(val===null){
                    if(_.isUndefined(item.showError)||(item.showError===true)){
                        err.push(item.name+'����Ϊ��');
                    }
                }else{
                    if(_.isUndefined(item.type)){
                        err.push('û������'+item.name+'�ֶε�����');
                    }
                    if(_.isUndefined(item.name)){
                        if(_.isUndefined(item.showError)||(item.showError===true)){
                            err.push('û������'+item.name+'�ֶε�����');
                        }

                    }
                    if(item.type==='int'){
                        if(isNaN(val)){
                            err.push(item.name+'����������');
                        }
                        //else if(val<=0){
                        //    err.push(item.name+'�������0')
                        //}
                        else{
                            check_rule();
                        }
                    }
                    else if(item.type==='string'){
                        if(!_.isString(val)){
                            err.push(item.name+'�������ַ�������');
                        }
                        else if(val.trim()===''){
                            if(_.isUndefined(item.showError)||(item.showError===true)){
                                err.push(item.name+'����Ϊ��');
                            }

                        }else{
                            check_rule();
                        }
                    }
                    else if(item.type==='date'){
                        if(!_.isString(val)){
                            err.push(item.name+'�������ַ�������');
                        }
                        else if(val.trim()===''){
                            if(_.isUndefined(item.showError)||(item.showError===true)){
                                err.push(item.name+'����Ϊ��');
                            }

                        }else{
                            if(item.format==='y-m-d'){
                                if(!isDate(val)){
                                    err.push(item.name+'��������������')
                                }else{
                                    check_rule();
                                }
                            }else if(item.format==='y-m-d h:i:s'){
                                if(!isDateTime(val,'y-m-d h:i:s')){
                                    err.push(item.name+'��������������')
                                }else{
                                    check_rule();
                                }
                            }else if(item.format==='y/m/d h:i:s'){
                                if(!isDateTime(val,'y/m/d h:i:s')){
                                    err.push(item.name+'��������������')
                                }else{
                                    check_rule();
                                }
                            }
                        }
                    }else if(item.type==='array'){
                        if(!_.isArray(val)){
                            err.push(item.name+'������array����');
                        }else{
                            check_rule();
                        }
                    }


                }



            }else{
                if(_.isUndefined(item.showError)||(item.showError===true)){
                    err.push(item.name+'����Ϊ��');
                }

            }
        }
        //��֤_additionalRules
        if(_additionalRules!==null){


            if(!_.isArray(_additionalRules)){
                err.push('ȫ�ֹ����б����������');
            }else{
                for(var j in _additionalRules){
                    var rule=_additionalRules[j];
                    if(rule.length<2){
                        err.push('ȫ�ֹ���ÿһ��У������������һ��У�鷽����һ��������ʾ��Ϣ');
                    }else{
                        if(!_.isFunction(rule[0])){
                            err.push('ȫ�ֹ���ÿһ��У�����ĵ�һ�������һ��function�ҷ���true����false');
                        }else{
                            if(!_.isString(rule[1])){
                                err.push('ȫ�ֹ���ÿһ�������ڶ��������һ���ַ������͵���ʾ��Ϣ');
                            }else{
                                //console.log('vallllllll',val)
                                if(rule[0].call(formData)!==true){
                                    err.push(rule[1]);
                                }
                            }
                        }
                    }
                }
            }

        }


        var result;
        if(err.length===0){
            result={
                status:'OK',
                formData:formData
            }
        }else{
            result={
                status:'ERROR',
                err:err,
                formData:formData
            }
        }

        if(!_.isUndefined(cb)){
            if(_.isFunction(cb)){
                cb(result);
            }else{
                err.push('����������������һ���ص�����');
            }

        }
    }


    if ("function" === typeof define && define.amd){
        define('V', [], validate);
    }
    else if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            module.exports=validate;
        }
    } else {
        if(_.isUndefined(jQuery)){
            global.V=validate;
        }else{
            jQuery.extend({
                V:validate
            })
        }

    }
})(this);