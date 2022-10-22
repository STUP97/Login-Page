function Student (name, id, pw, phone_number, birth){
    this.name = name;
    this.id = id;
    this.pw = pw;
    this.phone_number = phone_number;
    this.birth = birth;
}
function Course (course_id, course_name, course_num, course_day, course_time){
    this.course_id = course_id;
    this.course_name = course_name;
    this.course_num = course_num;
    this.course_day = course_day;
    this.course_time = course_time;
}

let database = new Array();
let database_Course = new Array();
const { response } = require('express');
const express = require('express');
let path = require('path');
let static = require('serve-static');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const app = express();
app.use(bodyParser.urlencoded({extended : false}));
app.use(express.static(path.join(__dirname, 'public')));


let login_id;
let login_check = false;



app.get('/',(request,response) => {
    login_id = undefined;
    login_check = false;
    response.sendFile(path.join(__dirname,'public/login.html'));
})
app.get('/signup/',(request,response) => {
    response.sendFile(path.join(__dirname,'public/signup.html'));
})
app.get('/find/',(request,response) => {
    response.sendFile(path.join(__dirname,'public/find.html'));
})
app.get('/findid/',(request,response) => {
    response.sendFile(path.join(__dirname,'public/findid.html'));
})
app.get('/findpw/',(request,response) => {
    response.sendFile(path.join(__dirname,'public/findpw.html'));
})
app.get('/menu/',(request,response) => {
    if(login_check){
        response.sendFile(path.join(__dirname,'public/menu.html'));
    }
    else{
        let output = '';
        output += "<script>";
        output +=   "alert('잘못된 접근입니다.');"
        output +=   "location.href='/'"
        output += "</script>";
        response.send(output);
    }
})
app.get('/sugang/',(request,response) => {
    response.sendFile(path.join(__dirname,'public/sugang.html'));
})
app.get('/print/',(request,response) => {
    response.sendFile(path.join(__dirname,'public/print.html'));
})

app.post('/login/',(request,response)=>{
    let id = request.body.user_id;
    let pw = request.body.user_pw;
    let output = '';
    let check = false;
    for(let i=0; i<database.length; i++){
        if(database[i].id == id && database[i].pw == pw){
            check = true;
            login_check = true;
            login_id = id;
            response.redirect('/menu/');
        }
    }
    if(!check){
        login_id = id;
        output += "<script>";
        output +=   "alert('아이디 또는 비밀번호를 확인해주십시오.');"
        output +=   "history.back();" 
        output += "</script>";
        response.send(output);
    }
})

app.post('/signup/',(request,response)=>{
    let name = request.body.user_name;
    let id = request.body.user_id;
    let pw = request.body.user_pw;
    let phone_number = request.body.user_phone_number;
    let birth = request.body.year + request.body.month + request.body.day;
    let reg1 = /^[가-힣]{3,4}$/
    let reg2 = /^(010)\d{4}\d{4}$/
    let output = '';
    for(let i=0; i<database.length; i++){
        if(database[i].id == id){
            output += "<script>"
            output +=   "alert('중복된 아이디가 있습니다.');"
            output +=   "location.href='/'"
            output += "</script>";
            response.send(output);
        }
    }

    if(!reg1.test(name)){
        output += "<script>"
        output +=   "alert('이름은 한글로만 3글자부터 4글자까지 작성 가능. ex1)이주호 ex2)남궁민석');"
        output +=   "location.href='/signup'"
        output += "</script>";
        response.send(output);
    }
    else if(!reg2.test(phone_number)){
        output += "<script>"
        output +=   "alert('번호는 -제외 010 포함하여 11자리 숫자로 작성. ex)01065652857');"
        output +=   "location.href='/signup'" 
        output += "</script>";
        response.send(output);
    }
    else{
        database[database.length] = new Student(name,id,pw,phone_number,birth);
        output += "<script>"
        output +=   "alert('가입완료');"
        output +=   "location.href='/'"
        output += "</script>";
        response.send(output);
    }
})

app.post('/findid/',(request,response)=>{
    let name = request.body.user_name;
    let phone_number = request.body.phone_number;
    let birth = request.body.year + request.body.month + request.body.day;
    let check = false;
    for(let i=0; i<database.length; i++){
        if(database[i].name == name && database[i].phone_number == phone_number && database[i].birth == birth ){
            check = true;
            let output = '';
            output += "<script>";
            output += "let id = '" + database[i].id + "';";
            output += "alert(id);";
            output +=   "location.href='/'"
            output += "</script>";
            response.send(output);
        }
    }
    if(!check){
        let output = '';
        output += "<script>";
        output += "alert('일치하는 정보가 없습니다.');";
        output +=   "location.href='/'"
        output += "</script>";
        response.send(output);
    }
})

app.post('/findpw/',(request,response)=>{
    let name = request.body.user_name;
    let id = request.body.user_id;
    let phone_number = request.body.phone_number;
    let birth = request.body.year + request.body.month + request.body.day;
    let check = false;
    for(let i=0; i<database.length; i++){
        if(database[i].name == name && database[i].id == id && database[i].phone_number == phone_number && database[i].birth == birth ){
            check = true;
            let output = '';
            output += "<script>";
            output += "let pw = '" + database[i].pw + "';";
            output += "alert(pw);";
            output +=   "location.href='/'"
            output += "</script>";
            response.send(output);
        }
    }
    if(!check){
        let output = '';
        output += "<script>";
        output += "alert('일치하는 정보가 없습니다.');";
        output +=   "location.href='/'"
        output += "</script>";
        response.send(output);
    }
})

app.post('/menu/',(request,response) => {
    let id = login_id;
    let name;
    for(let i=0; i<database.length; i++){
        if(database[i].id == login_id){
            name = database[i].name;
        }
    }
    let login_data = [id,name]
    response.send(login_data)
})

app.post('/sugang/',(request,response) => {
    let course_id = login_id;
    let course_name = request.body.course_name;
    let course_num = request.body.course_num;
    let course_day = request.body.course_day;
    let course_time = request.body.course_time_start + "-" + request.body.course_time_end;
    database_Course[database_Course.length] = new Course(course_id,course_name,course_num,course_day,course_time);
    let output = '';
    output += "<script>";
    output +=   "alert('" + course_id + " " + course_name + " " + course_num + " " + course_day + " " + course_time + "등록되었습니다.');";
    output +=   "location.href='/sugang/';"
    output += "</script>";
    response.send(output);
})

app.post('/print/',(request,response) => {
    response.send(database_Course)
})

app.listen(9999, () =>{
    console.log("Server Run.")
});
