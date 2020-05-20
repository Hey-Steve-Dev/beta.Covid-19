const ui = new UI();
var totalCases = null;
var totalDeaths = null;
var totalRecovered = null;
const mortRate = document.querySelector('#mortRate');
const surRate = document.querySelector('#surRate');
const active = document.querySelector('#active');
const NewConfirmedlbl = document.querySelector('#NewConfirmed');
const TotalConfirmedlbl = document.querySelector('#TotalConfirmed');
const NewDeathslbl = document.querySelector('#NewDeaths');
const TotalDeathslbl = document.querySelector('#TotalDeaths');
const NewRecoveredlbl = document.querySelector('#NewRecovered');
var trueToday = new Date()
var USdayOneCases = [];
var USdayOneDeaths = [];
var USdayOneReco = [];


popCountryList()

//event listener for County  
searchCountySelect.addEventListener("change", changeCounty);
//event listener for State
 searchStateSelect.addEventListener('change',changeState);
//event listener for Country
 searchCountry.addEventListener("change", changeCountry );
//event listener for Date
 fromWhen.addEventListener("change", changeTime);


//this calls summary api and gets country and populates it then calls pop states below.
function popCountryList(){

trueToday = cleanDate(trueToday)
fromWhen.value = trueToday
const countries = new SummaryData("https://api.covid19api.com/summary");
countries.getAllCountries()
.then(data => popStateList())
.catch(err => showError(err));
}

//this fills in the state list according to the country 
function popStateList(){
  //clear what is in the list for county
  var length = searchCountySelect.options.length;
  for (i = length-1; i >= 0; i--) {
    searchCountySelect.options[i] = null;
  }

  //clear what is in the list for state
  var length = searchStateSelect.options.length;
  for (i = length-1; i >= 0; i--) {
  searchStateSelect.options[i] = null;
  } 
   let newSlug = new SlugMaker("confirmed",false);
   var states = new StateList(newSlug.returnUrl());
   states.getAllStates()
   .then(data => startUSA() )
   .catch(err => showError(err));
}
//this fills in the county list according to the state
function popCountyList(){

  var length = searchCountySelect.options.length;
  for (i = length-1; i >= 0; i--) {
    searchCountySelect.options[i] = null;
  }

     USdayOneCases.collectData()
     .then (data => addToCounty(data))
     .catch(err => showError(err))
    
    


}

function addToCounty(data){
  let arrayOfCountys = []
  data.forEach(Province => {
    
    if(Province.Province === searchStateSelect.value){
      arrayOfCountys.push(Province.City)
     }
    })

    arrayOfCountys = arrayOfCountys.filter((a, b) => arrayOfCountys.indexOf(a) === b)

    //Sort
    arrayOfCountys = arrayOfCountys.sort();
    searchCountySelect.options[searchCountySelect.options.length] = new Option('', '', true,true);
    arrayOfCountys.forEach(arrayOfCountys =>{
       //add to select state list box
       searchCountySelect.options[searchCountySelect.options.length] = new Option(arrayOfCountys);
    })


}

//this changes the location and date on the results card
function changeLocationHeader(place){
   let t = fromWhen.value + "T00:00"
   let realDate = new Date(t)
 
 
   dd = String(realDate.getDate()).padStart(2, '0');
   mm = String(realDate.getMonth() + 1).padStart(2, '0'); //January is 0!
   yyyy = realDate.getFullYear();
   
   let readableDate = mm+"-"+dd+"-"+yyyy;
       
   let htmlString = `<h3>${place}</h3>`
   areaSearched.innerHTML = htmlString;
   
   searchDate.innerHTML = readableDate;
 }

 //this formats the date to match the dates in the api strings
 function cleanDate(aDate){
   dd = String(aDate.getDate()).padStart(2, '0');
   mm = String(aDate.getMonth() + 1).padStart(2, '0'); //January is 0!
   yyyy = aDate.getFullYear();
   let newCleanDate = yyyy + '-' + mm + '-' + dd;
   return newCleanDate;
 }

 //this returns a number string with commas
function numberWithCommas(x) {
   return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
//figures out the mortality rate and survival rate along with active caes.
function populateRates(){
let mortalRate = null;
let survRate = null;
let activeCases = null;



mortalRate = (totalDeaths/totalCases)*100
mortalRate = Math.round(mortalRate)
survRate = (totalRecovered/totalCases)*100
survRate = Math.round(survRate)
activeCases = totalCases - totalRecovered



if(!mortalRate){
   mortRate.innerHTML = ("Mortality rate unknown")
} else {mortRate.innerHTML = ("Mortality rate " +mortalRate + "%")}

if(!survRate){
   surRate.innerHTML= ("Survival rate unknown")
   } else {surRate.innerHTML= ("Survival rate " + survRate + "%")}

if(!activeCases){
   active.innerHTML= ("Active cases unknown")
   
} else {active.innerHTML = (numberWithCommas(activeCases) + " active")}

   
}
//returns a clean discription of where you are serching for UI
function findThePlace(){
   let thePlace = null;
         if (searchCountySelect.value === "" && searchStateSelect.value !== ""){thePlace = searchStateSelect.value};

         if (searchCountySelect.value !== "" && searchStateSelect.value !== ""){
           thePlace = searchCountySelect.value + " county " + searchStateSelect.value 
         };

         if (searchCountySelect.value === "" && searchStateSelect.value === ""){
            let countrySelectText = searchCountry.options[searchCountry.selectedIndex];
            thePlace = countrySelectText.text; 
         };
      return thePlace;
}

//the function waits until all totals are back from the async functions
function areStatsPopulated(){
   
  if(totalCases && totalDeaths && totalRecovered ){
   
   populateRates()
  }

}

//resets mortality rate and survival rate along with active caes.
function resetRates(){
 totalCases = null;
 totalDeaths = null;
 totalRecovered = null;
 totalActive = null;
}

//shows errors in the DOM if there is an error from the api
function showError(error){
   //create div
   const errorDiv = document.createElement('div');
   
   // get elements
   const card = document.querySelector('.card');
   const heading = document.querySelector('.heading');
   
   // add class
   errorDiv.className = 'alert alert-danger mx-auto';
   // create text note and append to div
   errorDiv.appendChild(document.createTextNode("Something went wrong with the request, please try again."));
   
   //Instert error above heading
   card.insertBefore(errorDiv, heading);
   console.log(error);
   // Clear error after 3 seconds
   setTimeout(clearError, 5000);
   
}

//clears the error in the DOM from ui
function clearError(){
document.querySelector('.alert').remove();
}

//makes 3 api calls for cases, deaths and recovered retuns per Country numbers
function changeCounty(){
  showLoading()
  USdayOneCases.getCasesPerCounty()
  .then(data => ui.setCases(data))
  .catch(err => showError(err));
 
  USdayOneDeaths.getCasesPerCounty()
  .then(data => ui.setDeaths(data))
  .catch(err => showError(err));

  USdayOneReco.getCasesPerCounty()
  .then(data => ui.setRecovered(data))
  .catch(err => showError(err));

  let countryText = searchCountry.options[searchCountry.selectedIndex].text
  changeLocationHeader(countryText)
   
   
 
 }

//Calls and sets cases from pre pop USA data,  retuns per County numbers
 function changeCountry(){
  showLoading()
   popStateList()
   resetRates()
   let newSlug = new SlugMaker("confirmed",false);
   
   let newCases = new RecordSet(newSlug.returnUrl());
     
   newCases.getCasesPerCountry()
   .then(data => ui.setCases(data))
   .catch(data => showError(err));
  
   
   newSlug = new SlugMaker("deaths",false);
 
   let newDeaths = new RecordSet(newSlug.returnUrl());
     
   newDeaths.getCasesPerCounty()
   .then(data => ui.setDeaths(data))
   .catch(err => showError(err));
   
   newSlug = new SlugMaker("recovered",false);

   let newRecovered = new RecordSet(newSlug.returnUrl());
     
   newRecovered.getCasesPerCounty()
   .then(data => ui.setRecovered(data))
   .catch(err => showError(err));
 
   let countryText = searchCountry.options[searchCountry.selectedIndex].text
   changeLocationHeader(countryText)

  
 } 

//Calls and sets cases from pre pop USA data,  retuns per State numbers
 function changeState() {
  showLoading()
  popCountyList(); 
   
  
  USdayOneCases.getCasesPerState()
   .then(data => ui.setCases(data))
   .catch(err => showError(err));
  
   USdayOneDeaths.getCasesPerState()
   .then(data => ui.setDeaths(data))
   .catch(err => showError(err));

   USdayOneReco.getCasesPerState()
   .then(data => ui.setRecovered(data))
   .catch(err => showError(err));
 
   let countryText = searchCountry.options[searchCountry.selectedIndex].text
   changeLocationHeader(countryText)
   
   
   
   changeLocationHeader(searchStateSelect.value);
 
   
  
 } 

 // makes 3 api calls for cases, deaths and recovered country USA selected
 function startUSA(){
   resetRates()
   let newSlug = new SlugMaker("confirmed",false);
   
   let newCases = new RecordSet(newSlug.returnUrl());
     
   newCases.getCasesPerCountry()
   .then(data => ui.setCases(data))
   .catch(err => showError(err));
  
   
   newSlug = new SlugMaker("deaths",false);
 
   let newDeaths = new RecordSet(newSlug.returnUrl());
     
   newDeaths.getCasesPerCountry()
   .then(data => ui.setDeaths(data))
   .catch(err => showError(err));
   
   newSlug = new SlugMaker("recovered",false);

   let newRecovered = new RecordSet(newSlug.returnUrl());
     
   newRecovered.getCasesPerCountry()
   .then(data => ui.setRecovered(data))
   .catch(err => showError(err));
 
   let countryText = searchCountry.options[searchCountry.selectedIndex].text
   changeLocationHeader(countryText)

   // this load the larger USdayOneData. This process take a few seconds.
   USdayOneCases = new RecordSet("https://api.covid19api.com/dayone/country/united-states/status/confirmed");
   USdayOneCases.collectData()
   .then(data => console.log("day one Cases"))
   .catch(err => showError(err));

   USdayOneDeaths = new RecordSet("https://api.covid19api.com/dayone/country/united-states/status/deaths");
   USdayOneDeaths.collectData()
   .then(data => console.log("day one Deaths"))
   .catch(err => showError(err));

   USdayOneReco = new RecordSet("https://api.covid19api.com/dayone/country/united-states/status/recovered");
   USdayOneReco.collectData()
   .then(data => console.log("day one Recovered"))
   .catch(err => showError(err));


 }

 //NEEDS WORK ONLY CALLS PER COUNTRY
 function changeTime(){
   
  if(searchCountySelect.value !== ""){
    changeCounty()
  }
  if(searchCountySelect.value === "" && searchStateSelect.value !== ""){
    changeState()
  }
  if(searchCountySelect.value === "" && searchStateSelect.value === ""){
    changeCountry()
  }
  
    
   
}

function showLoading(){
   NewConfirmedlbl.value = "Loading..."
   TotalConfirmedlbl.value = "Loading..."
   NewDeathslbl.value = "Loading..."
   TotalDeathslbl.value  = "Loading..."
   NewRecoveredlbl.value = "Loading..."
}





 