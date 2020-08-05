localStorage.setItem('login','0');
let obj = {};
let val = [];
let val_1 =[];
val_2 =[];
let l1,l2,l3,l4,l5;
let keys = ["username","password"];
let key = ["username"];
let key_1 = ["password"];
let user;

let find_id;
(async function loadData() {
    let url = 'http://51.68.195.202:3000/users';
    let response = await fetch(url);
    let commits = await response.json(); // читаем ответ в формате JSON
    obj = commits;
    console.log(obj);
}());

function chekLog(){
    let findObj = {};
    l1 = document.getElementById('Username').value;
    l2 = document.getElementById('Password').value;
    // l2 = Number.parseInt(l2);
    val.push(l1,l2);
    
    for (let i = 0; i <= keys.length -1; i++) {
    findObj[keys[i]] = val[i];
    }
    
    console.log(findObj);
    
    const result = obj.filter(some =>
    Object.keys(findObj).every(key =>
    some[key] === findObj[key])
    );
    
    console.log(result);
    for (let value of Object.values(result[0])) {
        find_id = value;
        break;
      }
      console.log(find_id);
      localStorage.setItem('id',find_id);
    if(result.length == 0) {
    localStorage.setItem('login','0');
    alert("Incorrect data entered!")
    }else{
    localStorage.setItem('login','1');
    goToPage();
    }
    
    var user=getCookie("username");
    if (user != "") {
    alert("Welcome again " + user);
    } else {
    user = l1;
    if (user != "" && user != null) {
    setCookie("username", user, 30);
    }
    }
    
    
    }
    
    function setCookie(cname,cvalue,exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }
    
    function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
    c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
    return c.substring(name.length, c.length);
    }
    }
    return "";
    }

function goToPage()
{
	document.location.href = "http://127.0.0.1:5500/index.html";
}



function changePsw(){
    let findObj = {};
    l3 = document.getElementById("Username_psw").value;
    val_1.push(l3);
    for (let i = 0; i <= key.length -1; i++) {
        findObj[keys[i]] = val_1[i];
    }
    console.log(findObj); 

    const result = obj.filter(some => 
        Object.keys(findObj).every(key => 
          some[key] === findObj[key])
      );

      console.log(result);

      user = l3;

      if(result.length == 0) {
          alert("Incorrect data entered!")
      }else{
          changeForm();
      }
}

function changeForm() {
    let subscr1 = document.getElementById('subscr1');
    let subscr2 = document.getElementById('subscr2');
    let Password1 = document.getElementById('Password1');
    let Password2 = document.getElementById('Password2');
    let Username_psw = document.getElementById('Username_psw');
    let btn1 = document.getElementById('btn1');
    let btn = document.getElementById('btn')
    
    subscr1.style.display = "none";
    subscr2.style.display = "inline";
    Password1.style.display = "inline";
    Password2.style.display = "inline";
    Username_psw.style.display = "none";
    btn.style.display = "none";
    btn1.style.display = "inline";
    }

function changePassword(){
    let findObj = {};
    let l4 = document.getElementById('Password1').value;
    let l5 = document.getElementById('Password2').value;

    if(l4 !== l5){
        alert("Error with repeat password!!")
    }else{
        val_2.push(l4);
        for (let i = 0; i <= key_1.length -1; i++) {
            findObj[key_1[i]] = val_2[i];
        }
        console.log(findObj); 


        var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify([findObj]);

var requestOptions = {
  method: 'PATCH',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch(`http://51.68.195.202:3000/users?username=eq.${user}`, requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error))
  .then(goToLog());
    }
}


function goToLog()
{
	document.location.href = "http://127.0.0.1:5500/log.html";
}