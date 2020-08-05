let val = [];
let clear = [];
let l1,l2,l3,l4,l5,l6,l7,l8,l9,l10,l11,l12,l13,l14,l15,l16,l17,l18,l19,l20,l21,l22,l91,l92,l93,l94,l95,l96,l97,l98,l99,l100,l101,l102,l103,l104,l105,l106;

let keys_1 = ["username","password","email","mobile_phone_number","company_title","company_type","registered_trademark",
"company_register_number","trade_registration_number","kep_address",
"tax_office_city","tax_office_name","tax_number","signature_officer_title","signature_officer_name_surname","company_local_no",
"company_mobile_no","company_fax_no","company_address","contact_person_mobile_no","contact_person_email","membership_type"];

function postUsers(){
    let obj = {};
    l1 = document.getElementById('Personal_Username').value;
    l91 = document.getElementById('Username1').value;
    l2 = document.getElementById('Personal_Password').value;
    l92 = document.getElementById('Password1').value;
    l3 = document.getElementById('Email').value;
    l93 = document.getElementById('Email1').value;
    l4 = document.getElementById('mobile phone number1').value; //
    l5 = document.getElementById('Company_title').value;
    l95 = document.getElementById('Company_title1').value;
    l6 = document.getElementById('compnay type').value; //
    l7 = document.getElementById('Registered_trademark').value; 
    l8 = document.getElementById('Company_register_number').value;
    l106 = document.getElementById('Company_register_number1').value;
    l9 = document.getElementById('Trade_registration_number').value;
    l10 = document.getElementById('Kep_address').value;
    l100 = document.getElementById('Kep_address1').value;
    l11 = document.getElementById('Tax_office_city').value;
    l101 = document.getElementById('Tax_office_city1').value;
    l12 = document.getElementById('Tax Office').value; //
    l13 = document.getElementById('Tax_number').value;
    l96 = document.getElementById('Tax_number1').value;
    l14 = document.getElementById('title of person').value;
    l102 = document.getElementById('title of person1').value;
    l15 = document.getElementById('name surnmae').value;
    l103 = document.getElementById('name surnmae1').value;
    l16 = document.getElementById('Local_no').value;
    l97 = document.getElementById('Local_no1').value;
    l17 = document.getElementById('mobile No').value;
    l98 = document.getElementById('mobile No1').value;
    l18 = document.getElementById('Fax').value;
    l104 = document.getElementById('Fax1').value;
    l19 = document.getElementById('Address').value;
    l105 = document.getElementById('Address1').value;
    l20 = document.getElementById('mobile phone number').value;
    l21 = document.getElementById('Personal_Email').value;
    l99 = document.getElementById('Personal_Email1').value;
    l22 = document.getElementById('membership type : Company title').value; //

  
    val.push(l1,l91,l2,l92,l3,l93,l4,l5,l95,l6,l7,l8,l106,l9,l10,l100,l11,l101,l12,l13,l96,l14,l102,l15,l103,l16,l97,l17,l98,l18,l104,l19,l105,l20,l21,l99,l22);
    console.log(val);

    
    for(let i=0;i<=val.length -1;i++){
      if(val[i] == ""){
         if(l1.length == 0){
            if(i == 7 || i == 10 || i == 19){
              clear.push(val[i]);
              console.log("success");
            }
         } else if(l91.length == 0){
            if(i == 11 || i == 14){
              clear.push(val[i]);
              console.log("success");
            }
         }else {
           continue;
         }
      }else{
        clear.push(val[i]);
      }
    }
    console.log(clear);
    
    for (let i = 0; i <= keys_1.length -1; i++) {
      // if(i == 0){
      //   obj[keys_1[i]] = 4;
      // }
      // else{
        obj[keys_1[i]] = clear[i]; 
        if(obj[keys_1[i]] ==  undefined){
          obj[keys_1[i]] = null;
        // }  
      }
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

fetch("http://51.68.195.202:3000/users", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));
}