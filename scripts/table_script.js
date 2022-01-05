let table = document.querySelector(".responsive.centered")
let tbody = table.querySelector('tbody')
let div_inflow = document.querySelector(".inflow")
let div_outflow = document.querySelector(".outflow")
let div_gross = document.querySelector(".gross")
let header = document.querySelector(".month_year_header")
const random = (min,max)=>Math.floor(Math.random()*(max-min))+min;

let row_div = []

var param = new URLSearchParams(window.location.search)
const data = JSON.parse(param.get('month_year'))
const data2 = JSON.parse(param.get('withdraw_deposit'))
let retrieved_local_storage = JSON.parse(localStorage.getItem("transactions") || "[]");


let total_deposit = Number(data2["total_deposits"])
let total_withdraw = Number(data2["total_withdraws"])
let balance = total_deposit - total_withdraw
total_withdraw == 0 ? 
    div_outflow.querySelector(".p_outflow").innerText = "$"+total_withdraw:
    div_outflow.querySelector(".p_outflow").innerText = "- $"+total_withdraw;
div_inflow.querySelector(".p_inflow").innerText = "$"+total_deposit

balance < 0 ? 
  div_gross.querySelector(".p_balance").innerText = "- $"+ -balance.toFixed(2):
  div_gross.querySelector(".p_balance").innerText = "$"+balance.toFixed(2);
  
header.innerText = data["month"]+" "+data["year"];

const createTableRow = (element, transaction_type) =>{
    
  //creating a table row to hold data
  let table_row = document.createElement('tr');
    const withdraw = document.createElement('td');
        const img = document.createElement('img');
        const span = document.createElement('span')
        span.innerText = transaction_type;
        span.innerText=="withdraw" ? img.src = "image_fold/downindicator.svg" :  img.src = "image_fold/up.png";
        span.innerText=="withdraw" ? table_row.style.backgroundColor="#830c141a" : table_row.style.backgroundColor="#4a464c2c" ;
        
    withdraw.appendChild(img);
    withdraw.appendChild(span)
    withdraw.className = "td_withdraw";
    table_row.appendChild(withdraw);
    const transaction_amount = document.createElement('td');
    transaction_amount.className = "td_trans_amount";
    transaction_amount.innerText = "$"+element["amount"];
    table_row.appendChild(transaction_amount);
    table_row.innerHTML += '<td class="td_purpose">'+element["purpose"]+'</td>';
    const del_td = document.createElement('td');
        const del_img = document.createElement('img');
        del_img.className = "delete_row"
        del_img.src = "image_fold/trash.svg"
    del_td.appendChild(del_img)
    table_row.appendChild(del_td)
    p_tag = document.createElement('p')
    p_tag.className ="key_tag"
    p_tag.innerText =element['key']
    p_tag.style.display ="none"
    table_row.appendChild(p_tag)
  return table_row;

}

if(data2["deposits"]){
    data2["deposits"].forEach(element => {
        tb = createTableRow(element, "deposit")
    
        row_div.push(tb);
    });
}
if(data2["withdraws"]){
  data2["withdraws"].forEach(element => {
      tb = createTableRow(element, "withdraw")
    
      row_div.push(tb)
  });
}
function popOut(){
  const position = random(0, row_div.length)
  const item = row_div.splice(position,1)
  return item;
}

const row_length = row_div.length
for(let i = 0; i<row_length; i++){
  row_item = popOut()
  tbody.insertBefore(row_item[0], tbody.lastElementChild)
}

table.addEventListener("dblclick",(e)=>{
  if(e.target.className==="delete_row"){
    key = e.target.parentElement.parentElement.querySelector(".key_tag").innerText
    console.log(e.target.parentElement.parentElement)
    e.target.parentElement.parentElement.remove()
    m = retrieved_local_storage.splice(key,1)
    console.log(key)
    console.log(m)
    localStorage.setItem("transactions", JSON.stringify(retrieved_local_storage)) 
    window.location.href = "index.html";
  }
})