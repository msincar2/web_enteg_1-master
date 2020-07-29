function personal () {
    let fields = document.getElementById("fields");
    let field1 = document.getElementById("field1");
    let check = document.getElementById("check");
    let btn1 = document.getElementById("btn1");
    let second = document.getElementById("second");

    fields.style.display = "inline";
    field1.style.display = "inline";
    field2.style.display = "none";
    field3.style.display = "none";
    check.style.display = "none";
    btn1.style.display = "none";
    second.checked = false;
    first.checked = true;
}

function company () {
    let fields = document.getElementById("fields");
    let field1 = document.getElementById("field1");
    let field2 = document.getElementById("field2");
    let field3 = document.getElementById("field3");
    let check = document.getElementById("check");
    let btn1 = document.getElementById("btn1");
    let first = document.getElementById("first");

    field2.style.display = "inline";
    field3.style.display = "inline";
    fields.style.display = "none";
    field1.style.display = "none";
    check.style.display = "none";
    btn1.style.display = "none";
    first.checked = false;
    second.checked = true;
}