let val = [];
let l1,l2,l3,l4,l5;
let keys = ["Username","Password","Name","Surname","Telephone"];
function postUsers(){
    let obj = {};
    l1 = document.getElementById('Username').value;
    l2 = document.getElementById('Password').value;
    l3 = document.getElementById('Name').value;
    l4 = document.getElementById('Surname').value;
    l5 = document.getElementById('Telephone').value;

    val.push(l1,l2,l3,l4,l5);

    for (let i = 0; i <= keys.length -1; i++) {
        obj[keys[i]] = val[i];
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

fetch("http://localhost:3000/users", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));



}