let obj = {};
let val = [];
let l1,l2;
let keys = ["Username","Password"];
(async function loadData() {
    let url = 'http://localhost:3000/users';
    let response = await fetch(url);
    let commits = await response.json(); // читаем ответ в формате JSON
    obj = commits;
    console.log(obj);
}());

function chekLog(){
    let findObj = {};
    l1 = document.getElementById('Username').value;
    l2 = document.getElementById('Password').value;
    l2 = Number.parseInt(l2);
    val.push(l1,l2);


    for (let i = 0; i <= keys.length -1; i++) {
        findObj[keys[i]] = val[i];
    }

    console.log(findObj);    

    const result = obj  .filter(some => 
        Object.keys(findObj).every(key => 
          some[key] === findObj[key])
      );

      console.log(result);

      if(result.length == 0) {
          alert("Incorrect data entered!")
      }else{
          goToPage();
      }
    
      
}

function goToPage()
{
	document.location.href = "http://127.0.0.1:5500/index.html";
}

function initLogin(){ //при заходе на страницу
    loginInput.value = localStorage.getItem('savedLogin') || ''; //loginInput это html input
  }
  
function  login(){ //обработчик входа
   localStorage.saveItem('savedLogin', loginInput.value);
  }