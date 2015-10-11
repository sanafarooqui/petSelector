/* initializes the page */    
function initailizePage(){
         //detect the browser
         if(!detectBrowser()){
            return;
         }
    //create the first select
        createSelect("data",true); 
    }

/* detect browser - if browser is Safari or version of IE is less than 9 show error */
      function detectBrowser(){
        if(BrowserDetect.browser == "Safari" || (BrowserDetect.browser === "Explorer" && BrowserDetect.version <9)){
            var failDiv = document.createElement("div");
            failDiv.setAttribute("id","browserFail");
            document.getElementById("dogsDiv").appendChild(failDiv);

            var t1 = document.createTextNode("Application not compatible with this browser");   
            failDiv.appendChild(t1);
            var t2 = document.createElement("a");
            t2.setAttribute("href","https://www.google.com/chrome/browser/desktop/index.html");
            t2.appendChild(document.createTextNode("Get compatible browser"));
            failDiv.appendChild(document.createElement("br"));
            failDiv.appendChild(t2);
            return false;
            }
         return true;
      }
      
      
    /* creates the selects taking in json data and first select boolean as params */
    function createSelect(selectData,isFirstSelect){
        var myDiv = document.getElementById("selectDiv");
        var dogDiv = document.getElementById("dogsDiv");
        
        //selectData is of the form "data.Dog.Large"  - eval to convert string into JSON call (JSON.parse wasnt working)
        var dataObj = eval(selectData);
        
        //clear out the results Div
        while(dogDiv.hasChildNodes()){
            dogDiv.removeChild(dogDiv.lastChild);
        }
       
        //if it is the last select show the result list
       if(dataObj.DogList){
          makeDogList(dataObj.DogList);
          return;
        }
        
        //else create the next select
        var mySelect = document.createElement("select"); 
        mySelect.id = "mySelect_"+selectData;
        myDiv.appendChild(mySelect);
        
        for(var key in dataObj){
            var option = document.createElement("option");
             
            var key1 = key.replace("_"," ");
            option.value = selectData+"."+key;
            option.text = key1;
            mySelect.appendChild(option);
        }
        
         //getting the state of the first select from local storage
          if(isFirstSelect && window.localStorage) {
              //setting the name so that we can identify its the first select
                mySelect.setAttribute("name","animal");
              if(localStorage.getItem("animal") != null){
                var defaultSelect = localStorage.getItem("animal");
                mySelect.value = defaultSelect;
              }
            }
      
          mySelect.addEventListener("change",function(){
            
              //check to see if it has a sibling if yes delete to start over
              if(mySelect.nextSibling){  
              while(mySelect.nextSibling){
                mySelect.parentElement.removeChild(mySelect.nextSibling);
                }
              }
              
             //save the state in local storage
            if(mySelect.getAttribute("name") === "animal" && window.localStorage) {
                localStorage.setItem("animal",mySelect.value);
                sessionStorage.setItem("animal",mySelect.value);
            }
              
           createSelect(mySelect.value,false); 
              
          },false);
}
      
    /* creates the form for saving user details */
    function getForm(){
        var ddiv = document.getElementById("dogsDiv");
        var formDiv = document.createElement("div");
        formDiv.setAttribute("id","formDiv");
        formDiv.className = "formSlide";
        
        //form title
        var pEle = document.createElement("p");
        pEle.setAttribute("id","formTitle");
        
        //getting user details from cookie if already exists
        var fnameC = GetCookie("firstName")?GetCookie("firstName"):"",
            lnameC = GetCookie("lastName")?GetCookie("lastName"):"",
            emailC = GetCookie("email")?GetCookie("email"):"";
        
        //getting cookie if already set for the user
        if(fnameC !== ""){
            pEle.appendChild(document.createTextNode("Welcome,"+fnameC+" "+lnameC+"!"));
        }else{
            pEle.appendChild(document.createTextNode("Interested/Questions?"));
        }
        
        formDiv.appendChild(pEle);
        
          //First name
        var t = document.createTextNode("First Name:"); 
        formDiv.appendChild(t);
        var firstName = document.createElement("INPUT"); 
        firstName.setAttribute("type", "text");
        firstName.setAttribute("id", "firstName");
        firstName.setAttribute("value",fnameC);
        formDiv.appendChild(firstName);
        formDiv.appendChild(document.createElement("br"));
          
          //Last Name
        var t1 = document.createTextNode("Last Name:"); 
        formDiv.appendChild(t1);
        var lastName = document.createElement("INPUT"); 
        lastName.setAttribute("type", "text");
        lastName.setAttribute("id", "lastName");
        lastName.setAttribute("value",lnameC);
        formDiv.appendChild(lastName);
        formDiv.appendChild(document.createElement("br"));
          
          //Email
        var t3 = document.createTextNode("Email:"); 
        formDiv.appendChild(t3);
        var email = document.createElement("INPUT"); 
        email.setAttribute("type", "text");
        email.setAttribute("id", "email");
        email.setAttribute("value",emailC);
        formDiv.appendChild(email);
        formDiv.appendChild(document.createElement("br"));
          
          //Comments
        var t4 = document.createTextNode("Comment:");
        var t5 = document.createElement("span");
       
        t5.setAttribute("style","display:block");
        t5.appendChild(t4);
        formDiv.appendChild(t5);
        var comment = document.createElement("TEXTAREA"); 
     
        comment.setAttribute("rows", "3");
        comment.setAttribute("cols", "30");
        comment.setAttribute("id", "comment");
        formDiv.appendChild(comment);
          
        formDiv.appendChild(document.createElement("br"));
        formDiv.appendChild(document.createElement("br"));
        
        //save Button
        var saveBtn = document.createElement("input");
        saveBtn.setAttribute("id","saveBtn");
        saveBtn.setAttribute("type","button");
        saveBtn.setAttribute("value","Save");
        saveBtn.onclick = saveForm;
        var d = document.createElement("div");
        d.setAttribute("align","center");
        d.appendChild(saveBtn);
        formDiv.appendChild(d);
          
        ddiv.appendChild(formDiv); 
        
      }
      

     /* saving and validating the form */
    function saveForm(){
          //regex from http://regexlib.com/
          var rex_name = /^[A-Za-z ]{3,20}$/,
              rex_lastname = /^[A-Za-z ]{3,30}$/,
              rex_email = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/i;
          
          var errDiv;
          var errorMsg="";
        
        //if error div doesnt exists create it
         if(!document.getElementById("errDiv")){
          errDiv = document.createElement("div");
          errDiv.setAttribute("id","errDiv");
          document.getElementById("formDiv").appendChild(errDiv);
         }else{
             //else remove all child elements
              errDiv = document.getElementById("errDiv");
             while(errDiv.hasChildNodes()){
                errDiv.removeChild(errDiv.lastChild);
             }
         }
          
        //validate form data
           if(!document.getElementById("firstName").value){
            var t1 = document.createTextNode("Please enter your first name.");   
            errDiv.appendChild(t1);
            errDiv.appendChild(document.createElement("br"));
              
          }else if(!rex_name.test(document.getElementById("firstName").value)){
            var t1 = document.createTextNode("First name should 3 to 20 characters.");   
            errDiv.appendChild(t1);
            errDiv.appendChild(document.createElement("br"));
          }
        
        if(!document.getElementById("lastName").value){
            var t1 = document.createTextNode("Please enter your last name.");   
            errDiv.appendChild(t1);
            errDiv.appendChild(document.createElement("br"));
           
          }else if(!rex_lastname.test(document.getElementById("lastName").value)){
            var t1 = document.createTextNode("Last name should be 3 to 30 characters.");   
            errDiv.appendChild(t1);
            errDiv.appendChild(document.createElement("br"));
          }
        
        if(!document.getElementById("email").value){
             var t1 = document.createTextNode("Please enter your email.");   
             errDiv.appendChild(t1);
             errDiv.appendChild(document.createElement("br"));
          }else if(!rex_email.test(document.getElementById("email").value)){
              var t1 = document.createTextNode("Please enter a valid email.");   
              errDiv.appendChild(t1);
              errDiv.appendChild(document.createElement("br"));
          }
       
          if(errDiv.hasChildNodes()){
            return false;
          }
        
          var p = document.createElement("p");
          p.setAttribute("style","color:#2F4666");
          p.appendChild(document.createTextNode("Thanks for your interest!"));                                 errDiv.appendChild(p);
             
          //if no errors save user info in cookies
          SetCookie("firstName",document.getElementById("firstName").value);
          SetCookie("lastName",document.getElementById("lastName").value);
          SetCookie("email",document.getElementById("email").value);
       
         return true;
      }
     
      
    /* make the result list */
    function makeDogList(dogs){
     var ddiv = document.getElementById("dogsDiv");
     
     var i=0;
    //timeout so that the images slide one after another
     function dogTimeoutLoop(){
        setTimeout(function () {  
            var dog = dogs[i];
            var imageDiv = document.createElement("div");
            imageDiv.className = "imageSlide";
            imageDiv.setAttribute("name","imageDivs");
         
            //animal image
            var dogImage = new Image(120,120);
            dogImage.src = "images/"+dog.image;
          
            //for name and description
           var captionEle = document.createElement("div");
           captionEle.setAttribute("class","text-div");
            
           var txt = document.createTextNode(dog.name);
           captionEle.appendChild(txt);
            
           var des = document.createElement("p");
           des.appendChild(document.createTextNode(dog.description));
           des.setAttribute("class","description");
           captionEle.appendChild(des);
          
           imageDiv.appendChild(dogImage);
           imageDiv.appendChild(captionEle);
              
           ddiv.appendChild(imageDiv); 
           i++; 
           if(i == dogs.length){
              getForm();
           }
           if (i < dogs.length) {           
             dogTimeoutLoop();             
           } 
          
          }, 1500);
     }
     dogTimeoutLoop();
 }
    

/*  Below code - trying to add new data animals to the json object */

    function openDeveloperWindow(){
          var ddiv = document.getElementById("dogsDiv");
          var sdiv = document.getElementById("selectDiv"); 
          while (ddiv.hasChildNodes()) {
              ddiv.removeChild(ddiv.lastChild);
            }
         while (sdiv.hasChildNodes()) {
              sdiv.removeChild(sdiv.lastChild);
            }
        
          sdiv.appendChild(document.createTextNode("Select Animal:"));
        
          var saveBtn = document.createElement("input");
          saveBtn.setAttribute("id","saveAnimal");
          saveBtn.setAttribute("value","Save Animal");
          saveBtn.setAttribute("type","button");
          saveBtn.setAttribute("style","float:right");
          saveBtn.onclick = saveAnimal;
          ddiv.appendChild(saveBtn);
          
          
          var divLevel = document.createElement('div');
          divLevel.setAttribute("id",1+"_div");
          ddiv.appendChild(divLevel);
             
          addInputField(1,0,divLevel);
      }
      
    function addInputField(id,levelid,divLevel){
          
         var input1 = document.createElement("INPUT"); 
        input1.setAttribute("type", "text");
        input1.setAttribute("name",levelid);
        input1.setAttribute("id", id+"_input");
        input1.setAttribute("placeholder",id);
        divLevel.appendChild(input1);
       // ddiv.appendChild(document.createElement("br"));
          
         var addBtn = document.createElement("input");
         addBtn.setAttribute("id",id+"_addbtn");
         addBtn.setAttribute("type","button");
         addBtn.setAttribute("value","A");
         divLevel.appendChild(addBtn);
        
          var listBtn = document.createElement("input");
         listBtn.setAttribute("id",id+"_listbtn");
         listBtn.setAttribute("type","button");
         listBtn.setAttribute("value","L");
         divLevel.appendChild(listBtn); 
        
          listBtn.onclick = function(){
              var ddiv = document.getElementById("dogsDiv");
             //get btnid to get input field
             var btnid = parseInt(this.id,10);
             //get current input to get the name i.e level
             var currentInput = document.getElementById(btnid+"_list");
           
             //to get the length for div id calculation
             var btnidString = ""+btnid;
             var nextlevel = btnidString.length + 1;
             var divLevel = document.getElementById(nextlevel+"_div");
             console.log(divLevel);
             if(!divLevel){
              divLevel = document.createElement('div');
              divLevel.setAttribute("id",nextlevel+"_div");
              ddiv.appendChild(divLevel);
             }
             var nextLevelInputs = document.getElementsByName(btnid);
             var newid = btnid+""+nextLevelInputs.length;
            
             var input2 = document.createElement("INPUT"); 
             input2.setAttribute("type", "text");
             input2.setAttribute("name",btnid);
             input2.setAttribute("id", newid+"_list");
             input2.setAttribute("placeholder",newid);
             divLevel.appendChild(input2);
              
         };
          
         addBtn.onclick = function(){
              var ddiv = document.getElementById("dogsDiv");
             //get btnid to get input field
             var btnid = parseInt(this.id,10);
             //get current input to get the name i.e level
             var currentInput = document.getElementById(btnid+"_input");
           
             //to get the length for div id calculation
             var btnidString = ""+btnid;
             var nextlevel = btnidString.length + 1;
             var divLevel = document.getElementById(nextlevel+"_div");
             console.log(divLevel);
             if(!divLevel){
              divLevel = document.createElement('div');
              divLevel.setAttribute("id",nextlevel+"_div");
              ddiv.appendChild(divLevel);
             }
             var nextLevelInputs = document.getElementsByName(btnid);
             var newid = btnid+""+nextLevelInputs.length;
            
             addInputField(newid,btnid,divLevel);
         };
        
      }
      
    var JSONArr = "";
      
    function saveAnimal(){
       var animal = document.getElementById(1+"_input");
        var id = "1";
        var l1 = document.getElementsByName("1");
   
       for(var i=0;i<l1.length;i++){
           if(i==0){
                JSONArr +='{"'+l1[i].value+'"';
           }else{
            JSONArr += '"'+l1[i].value+'"';
           }
           
            saveAnimal2(l1[i].id);
           
            if(i==l1.length-1){
                JSONArr += '}';
            }else{
                 JSONArr += ',';
            }
        }
        
        var animalVal =  animal.value;
        
        data[animalVal] = JSON.parse(JSONArr);
        
        var obj = animal.value;
       
        createSelect('data',true);
     
        }
      
      
    function saveAnimal2(elemId){
       
               //if it has a next level
               var nextName = elemId.substring(0,elemId.indexOf("_input"));
               var nextArr = document.getElementsByName(nextName);
           
                 if(nextArr){
                   for(var j=0;j<nextArr.length;j++){
                        if((nextArr[j].id).indexOf("_list") > -1){              
                            JSONArr += ':{"DogList":[{"name":"'+nextArr[0].value+'","image":"kitten.jpeg","description":""}]}';
                        }else{
                           if(j==0){
                                JSONArr +=':{"'+nextArr[j].value+'"';
                           }else{
                                JSONArr += '"'+nextArr[j].value+'"';
                           }
                       var elemId = nextArr[j].id;       
                       saveAnimal3(elemId);
                   }
                       
                    if(j==nextArr.length-1){
                        JSONArr += '}';
                        }else{
                        JSONArr += ',';
                    }
                   }
                 }
            
           return JSONArr;
               
                
      }
      
    function saveAnimal3(elemId){
               //if it has a next level
               var nextName = elemId.substring(0,elemId.indexOf("_input"));
               var nextArr = document.getElementsByName(nextName);
           
                 if(nextArr){
                   for(var j=0;j<nextArr.length;j++){
                        
                        if((nextArr[j].id).indexOf("_list") > -1){                 
                        JSONArr += ':{"DogList":[{"name":"'+nextArr[0].value+'","image":"kitten.jpeg","description":""}]}';
                        
                        }else{
                       if(j==0){
                            JSONArr +=':{"'+nextArr[j].value+'"';
                       }else{
                        JSONArr += '"'+nextArr[j].value+'"';
                       }
                       var elemId = nextArr[j].id;
                    }
                       
                   }
                 }
            
           return JSONArr;  
      }
    
