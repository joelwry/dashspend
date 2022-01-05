document.addEventListener('DOMContentLoaded', function() {
    const submit_btn = document.querySelector('.submit_btn');
    const form = document.querySelector('#transaction_form');
    p_header = document.getElementsByClassName("p_header");
    p_balance = document.getElementsByClassName('p_balance');
    let grouped_array_of_year_balance = [];

    form.date.readOnly = true;
    form.time.readOnly = true;
    

    let date_picker_result = "";
    let time_picker_result = "";
    //form.date.value;
    
    // storing date picker value into date_picker_result variable
    clickedDate =(value) => {
       let date_gmt = new Date(value);
       date_picker_result = date_gmt.toDateString();
       form.date.value = date_picker_result;
    }
    // storing time picker value into time_picker_result variable
    clickedTime =(hour, min) => {
       time_picker_result = hour+":"+min;
       form.time.value = time_picker_result;
     }
    var date_picker = document.querySelectorAll('.datepicker');
    var time_picker = document.querySelectorAll('.timepicker');
    var date_instance = M.Datepicker.init(date_picker,{"onSelect":clickedDate});
    var time_instance = M.Timepicker.init(time_picker,{"onSelect":clickedTime,twelveHour:false});
  

    
   submit_btn.addEventListener('click', form_submit);

   //PROCESS FORM SUBMISSION EVENT
   function form_submit(event){
    event.preventDefault(); 
    let check_status = form.checkValidity();
    form.reportValidity();
    validateForm(event);
    if(check_status && form.date.value != "" && form.drop_down_list.value !=""){
        let retrieved_local_storage = JSON.parse(localStorage.getItem("transactions") || "[]");
        const full_date_time = form.date.value +" "+ form.time.value;
        approved_transaction_object = {
            amount: form.amount.value,
            purpose: form.purpose.value,
            date: full_date_time,
            type:form.drop_down_list.value
        }
        
        retrieved_local_storage.push(approved_transaction_object);
        //saving
        localStorage.setItem("transactions", JSON.stringify(retrieved_local_storage))
        const comment ="$" +form.amount.value+" will be processed for "+form.drop_down_list.value;
        M.toast({html: comment, classes: 'toast_comment'});
        
        const year = new Date(form.date.value).getFullYear();
        let bal = null;
        for(let item of grouped_array_of_year_balance){
            if(item['year']==year){
                bal = parseFloat(item["bal"])
                break;
            }
        }
        if(bal != null){
            p_header[0].innerText = year+" balance";
            if(form.drop_down_list.value.toLowerCase() ==="deposit"){
                balance = bal + parseFloat(form.amount.value);
                //now updating the balance of groupedarrayofbalance
                grouped_array_of_year_balance.find((item)=>{
                    if(item["year"]===year){
                        item["bal"] = balance;
                    }
                })
                balance < 0 ? p_balance[0].innerText = "- $"+ -balance.toFixed(2):
                p_balance[0].innerText = "$"+balance.toFixed(2);
            }else{
                balance = bal - parseFloat(form.amount.value)
                balance < 0 ? p_balance[0].innerText = "- $"+ -balance.toFixed(2):
                p_balance[0].innerText = "$"+balance.toFixed(2);
            }
        }else{
            const balance = year_balance(year);
            p_header[0].innerText = year+" balance";
            balance < 0 ? p_balance[0].innerText = "- $"+ -balance.toFixed(2):
                p_balance[0].innerText = "$"+balance.toFixed(2);
        }
        
        form.amount.value ="";
        form.purpose.value = "";
        form.date.value = "";
        form.time.value=""
        form.drop_down_list.value=""


    }

   }

   //form validation 
   validateForm = ()=>{
       if(form.amount.validity.valueMissing){
           form.amount.focus();
           form.amount.setCustomValidity("You have not input the amount you want to transact");
           return;
       }else{
        form.amount.setCustomValidity(''); 
       }
       if(parseFloat(form.amount.value) <= 0){
        form.amount.focus();
        form.amount.setCustomValidity("amount should be greater than 0");
        return;
       }else{
        form.amount.setCustomValidity(''); 
       }
       if(form.date.value === ""){
           form.date.focus();
           const comment = "click on date icon";
           M.toast({html: comment, classes: 'toast_comment'});
           return null;
       }
       if(form.drop_down_list.value ===""){
          form.drop_down_list.focus();
          const comment = "Select a transaction type"
          M.toast({html: comment, classes: 'toast_comment'});
          return null;
       }
      
    }

    //GETTING A PARTICULAR YEAR BALANCE
    year_balance = (year) =>{
        //work on this part
        let year_bal = 0;
        let table_obj = JSON.parse(localStorage.getItem("transactions") || "[]");
        for(let i = 0; i<table_obj.length; i++){
            if (new Date(table_obj[i]["date"]).getFullYear() == year){
                if(table_obj[i]['type'].toLowerCase()==="deposit"){
                year_bal +=  parseFloat(table_obj[i]['amount']);
                }
                else{
                    year_bal -= parseFloat(table_obj[i]['amount']);
                }
           }

           }
        
           bal_obj = {"year":year, bal:year_bal};
           grouped_array_of_year_balance.push(bal_obj);
            
        return year_bal;
    }
    

});

