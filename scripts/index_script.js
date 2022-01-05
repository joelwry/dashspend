
// selecting dom element in index.html page

var drop_down_year = document.querySelector(".dropdown_select.year_select");
var cards = document.querySelector(".card_stripped_row");
var overall_div_year = document.querySelector(".left_field.year_selector");
const null_div = document.querySelector('.null_transaction_div');

let treated_transaction_list = [];
let month_obj = {}

overall_div_year.addEventListener("click",(e)=>{
    const year = document.querySelector(".select-selected").innerText
    removeCardRow();
    const card_item = monthCardRowElement(month_obj, year)
    card_item.forEach((div)=>{
        cards.appendChild(div);
    })
})

function transactionArray(){
    let retrieved_storage = JSON.parse(localStorage.getItem("transactions") || "[]");
    const grouped_years = groupByYear(retrieved_storage, "date");
    for(const key in grouped_years){
        let total_deposit = 0;
        let total_withdraw = 0;
      const grouped_by_type = grouped_years[key].reduce(function(accumulator, current){
        if(current["type"]=="deposit"){
            total_deposit += Number(current["amount"]) 
        }
        if(current["type"]=="withdraw"){
            total_withdraw -= Number(current["amount"])
        }  
        if(!accumulator[current["type"]]){
            accumulator[current["type"]] = [];
        }
        accumulator[current["type"]].push(current);
        return accumulator;
      }, {});
      const obj = {
          "year": key,
          "total_deposit":total_deposit.toFixed(2),
          "total_withdraw":total_withdraw.toFixed(2),
          "transactions":grouped_by_type
        }
      treated_transaction_list.push(obj);
    }
   
}

function removeCardRow(){
    const count = cards.childElementCount
    for (let i=0; i<count; i++){
       cards.removeChild(cards.firstElementChild)
    }
}
function groupByYear(arr, criteria){
    key = 0;
    grouped_array = arr.reduce(function(accumulator, current){
        if(!accumulator[new Date(current[criteria]).getFullYear()]){
            accumulator[new Date(current[criteria]).getFullYear()] = [];
        }
        current["key"] = key
        accumulator[new Date(current[criteria]).getFullYear()].push(current);
        key = key + 1;
        return accumulator;
    }, {});
    return grouped_array;
}


function groupByMonth(arr){
   arr.forEach((e)=>{
       month_obj[e["year"]] ={ }
       if (e["transactions"]["deposit"]){
            e["transactions"]["deposit"].forEach((el)=>{
                    if(!month_obj[e["year"]][el["date"].substr(4,3)]){
                        month_obj[e["year"]][el["date"].substr(4,3)]= {}
                        month_obj[e["year"]][el["date"].substr(4,3)]["deposits"]= []
                        month_obj[e["year"]][el["date"].substr(4,3)]["total_deposits"]= 0
                        month_obj[e["year"]][el["date"].substr(4,3)]["total_withdraws"]= 0
                    }
                    month_obj[e["year"]][el["date"].substr(4,3)]["deposits"].push({
                        amount:el["amount"],
                        purpose:el["purpose"],
                        key:el["key"]
                    })
                    month_obj[e["year"]][el["date"].substr(4,3)]["total_deposits"] += Number(el["amount"]); 
            })
        }
       //work on withdraw object
       if (e["transactions"]["withdraw"]){
            e["transactions"]["withdraw"].forEach((el)=>{
                    if(!month_obj[e["year"]][el["date"].substr(4,3)]){
                        month_obj[e["year"]][el["date"].substr(4,3)]= {}
                        month_obj[e["year"]][el["date"].substr(4,3)]["withdraws"]= []
                        month_obj[e["year"]][el["date"].substr(4,3)]["total_withdraws"]= 0
                        month_obj[e["year"]][el["date"].substr(4,3)]["total_deposits"]= 0
                    }
                    if(!month_obj[e["year"]][el["date"].substr(4,3)]["withdraws"]){
                        month_obj[e["year"]][el["date"].substr(4,3)]["withdraws"]= []
                        
                    }
                    month_obj[e["year"]][el["date"].substr(4,3)]["withdraws"].push({
                        amount:el["amount"],
                        purpose:el["purpose"],
                        key:el["key"]
                    })
                    month_obj[e["year"]][el["date"].substr(4,3)]["total_withdraws"] += Number(el["amount"]); 
            })
        }
    })
        
}


function filterBy(arr, transaction_type){
    if(transaction_type != "all"){
        filtered_transaction = arr.filter(function(value){
            if(value["type"]===transaction_type){
                return value;
            }
        });
        return filtered_transaction;
    }else{
        return arr;
    }
}

monthCardRowElement =(obj, year)=>{
    let card_items = []
    for(key in obj[year]){
        const month = key
        let row = document.createElement("div");
        row.className = "row";
            let firstRowChild =  document.createElement("div");
            firstRowChild.className = "col l4 s4 start_balance"
            firstRowChild.innerText= "$"+Number(obj[year][key]["total_deposits"]).toFixed(2);
            
            let secondRowChild = document.createElement("div");
            secondRowChild.className = "col l4 s4 month_div";
                const a_tag = document.createElement("a");
                a_tag.className = "waves-effect waves-light btn";
                    const p_tag = document.createElement("p");
                    p_tag.innerText = month;
                    const icon = document.createElement("img");
                    if(Number(obj[year][key]["total_deposits"])-Number(obj[year][key]["total_withdraws"])<=0){
                    icon.src ="image_fold/downindicator.svg";
                    }
                    else{
                        icon.src ="image_fold/up.png";
                    }
                a_tag.appendChild(p_tag);
                a_tag.appendChild(icon);
                //still need to set href for a_tag
                a_tag.addEventListener('click',(e)=>{
                    var month_year = {
                        "year": year,
                        "month": month
                    }
                    var param = new URLSearchParams();
                    param.append("withdraw_deposit", JSON.stringify(obj[year][month]))
                    param.append("month_year", JSON.stringify(month_year))
                    var url = "./table.html?"+param.toString();
                    location.href = url;
                })
            secondRowChild.appendChild(a_tag);

            let thirdRowChild = document.createElement("div");
            thirdRowChild.className = "col l4 s4 end_balance"
            obj[year][key]["total_withdraws"] == 0 ? 
                thirdRowChild.innerText= "$"+Number(obj[year][key]["total_withdraws"]).toFixed(2): 
                thirdRowChild.innerText= "-$"+Number(obj[year][key]["total_withdraws"]).toFixed(2);
            
        row.appendChild(firstRowChild);
        row.appendChild(secondRowChild);
        row.appendChild(thirdRowChild);
        card_items.push(row)
    }
    
    
    return card_items;
}

let main_operation = ()=>{
    transactionArray();
    groupByMonth(treated_transaction_list)
    if(Object.keys(month_obj).length === 0){
      null_div.style.display = "block";
    }else{
        null_div.style.display = "none";
        key_list = []
        year = ""
        for(key in month_obj){
            key_list.push(key)
        }
        if(key_list.length > 1){
        year = key_list[key_list.length-1]
        }
        else if(key_list.length==1){
        year = key_list[0]
        }
        for(key in treated_transaction_list){
            const year = treated_transaction_list[key]["year"]
            let option_tag = document.createElement("option");
            option_tag.innerText = year;
            option_tag.value = year;
            drop_down_year.appendChild(option_tag);    
        }
        
        const card_item = monthCardRowElement(month_obj, year)
        card_item.forEach((div)=>{
            cards.appendChild(div);
        })
    }
}

// init main operation so as to make relevant call to functions defined above 
main_operation();
