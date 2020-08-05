let keys_api = ["user_id","marketplace","app_key","app_secret","api_username","api_password"];
let arr_api = [];
let id_user =parseInt(localStorage.getItem('id'));

let marketplace;
function getMarket(market){
marketplace =market;
}
let api_obg = {};
(async function loadData() {
    let url = 'http://51.68.195.202:3000/users_api';
    let response = await fetch(url);
    let commits = await response.json(); // читаем ответ в формате JSON
    api_obg = commits;
    console.log(api_obg);
}());

function postApi(){
    let obj = {};
    arr_api.push(id_user,marketplace);

    let app_key = document.getElementById('app_key').value;
    let app_key1 = document.getElementById('app_key1').value;
    let app_key2 = document.getElementById('app_key2').value;
    let app_key3 = document.getElementById('app_key3').value;
    if(app_key != ""){
        arr_api.push(app_key);
    }
    if(app_key1 != ""){
        arr_api.push(app_key1);
    }
    if(app_key2 != ""){
        arr_api.push(app_key2);
    }
    if(app_key3 != ""){
        arr_api.push(app_key3);
    }
    

    let app_secret = document.getElementById('app_secret').value;
    let app_secret1 = document.getElementById('app_secret1').value;
    let app_secret2 = document.getElementById('app_secret2').value;
    let app_secret3 = document.getElementById('app_secret3').value;
    if(app_secret != ""){
        arr_api.push(app_secret);
    }
    if(app_secret1 != ""){
        arr_api.push(app_secret1);
    }
    if(app_secret2 != ""){
        arr_api.push(app_secret2);
    }
    if(app_secret3 != ""){
        arr_api.push(app_secret3);
    }
    
   

    let api_username = document.getElementById('api_username').value;
    let api_username1 = document.getElementById('api_username1').value;
    let api_username2 = document.getElementById('api_username2').value;
    let api_username3 = document.getElementById('api_username3').value;
    if(api_username != ""){
        arr_api.push(api_username);
    }
    if(api_username1 != ""){
        arr_api.push(api_username1);
    }
    if(api_username2 != ""){
        arr_api.push(api_username2);
    }
    if(api_username3 != ""){
        arr_api.push(api_username3);
    }
    

    let api_password = document.getElementById('api_password').value;
    let api_password1 = document.getElementById('api_password1').value;
    let api_password2 = document.getElementById('api_password2').value;
    let api_password3 = document.getElementById('api_password3').value;
    if(api_password != ""){
        arr_api.push(api_password);
    }
    if(api_password1 != ""){
        arr_api.push(api_password1);
    }
    if(api_password2 != ""){
        arr_api.push(api_password2);
    }
    if(api_password3 != ""){
        arr_api.push(api_password3);
    }
    // arr_api.push(null);
    console.log(arr_api);

    for (let i = 0; i <= keys_api.length -1; i++) {
          obj[keys_api[i]] = arr_api[i]; 
        //   if(obj[keys_1[i]] ==  undefined){
        //     obj[keys_1[i]] = null;
      }
  
      console.log(obj);


      var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify([obj]);

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch("http://51.68.195.202:3000/users_api", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));
}