const ui = new UI();
var totalCases = null;
var totalDeaths = null;
var totalRecovered = null;
var totalActive = null;
const mortRate = document.querySelector('#mortRate');
const surRate = document.querySelector('#surRate');
const active = document.querySelector('#active');

//populateCountry drop down list
var trueToday = new Date()
trueToday = cleanDate(trueToday)
fromWhen.value = trueToday

const countries = new SummaryData("https://api.covid19api.com/summary");
countries.getAllCountries()
.then(data => popStateList())
.catch(err => console.log(err));




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
   let newSlug = new SlugMaker("confirmed",true);
   var states = new StateList(newSlug.returnUrl());
   states.getAllStates()
   .then(data => console.log("states loaded"))
   .catch(err => console.log(err));
}

//event listener for County  searchCountySelect
searchCountySelect.addEventListener("change", function searchCounty(){

     
   let newSlug = new SlugMaker("confirmed",false);
   
   let newCases = new RecordSet(newSlug.returnUrl());
     
   newCases.getCasesPerCounty()
   .then(data => ui.setCases(data))
   .catch(err => console.log(err));
   
   
 
 });

 searchStateSelect.addEventListener('change',function populateStatCardsFromState() {
   
   let newSlug = new SlugMaker("confirmed",false);
   
   let newCases = new RecordSet(newSlug.returnUrl());
   
   newCases.getCasesPerState()
   .then(data => ui.setCases(data))
   .catch(err => console.log(err));
 
   newSlug = new SlugMaker("deaths",false);
 
   let newDeaths = new RecordSet(newSlug.returnUrl());
     
   newDeaths.getCasesPerState()
   .then(data => ui.setDeaths(data))
   .catch(err => console.log(err));

   changeLocationHeader(searchStateSelect.value);
 
   
  
 } );

 searchCountry.addEventListener("change", function populateStatCards(){
  
   popStateList();
   let newSlug = new SlugMaker("confirmed",false);
   console.log(newSlug.returnUrl());
   let newCases = new RecordSet(newSlug.returnUrl());
     
   newCases.getCasesPerCountry()
   .then(data => ui.setCases(data))
   .catch(data => console.log(err));
  
   
   newSlug = new SlugMaker("deaths",false);
 
   let newDeaths = new RecordSet(newSlug.returnUrl());
     
   newDeaths.getCasesPerCounty()
   .then(data => ui.setDeaths(data))
   .catch(err => console.log(err));
   
   newSlug = new SlugMaker("recovered",false);

   let newRecovered = new RecordSet(newSlug.returnUrl());
     
   newRecovered.getCasesPerCounty()
   .then(data => ui.setRecovered(data))
   .catch(err => console.log(err));
 
   let countryText = searchCountry.options[searchCountry.selectedIndex].text
   changeLocationHeader(countryText)

   setTimeout(populateRates, 500);
   
   
   
  
 } );

 fromWhen.addEventListener("change", function searchTime(){
   
   //this always assumes you are changing country
   
   let newSlug = new SlugMaker("confirmed",false);
   let newCases = new RecordSet(newSlug.returnUrl());
     
   newCases.getCasesPerCountry()
   .then(data => ui.setCases(data))
   .catch(data => console.log(err));
  
   
   newSlug = new SlugMaker("deaths",false);
 
   let newDeaths = new RecordSet(newSlug.returnUrl());
     
   newDeaths.getCasesPerCounty()
   .then(data => ui.setDeaths(data))
   .catch(err => console.log(err));

   newSlug = new SlugMaker("recovered",false);

   let newRecovered = new RecordSet(newSlug.returnUrl());
     
   newRecovered.getCasesPerCounty()
   .then(data => ui.setRecovered(data))
   .catch(err => console.log(err));

   setTimeout(populateRates, 500);
    
   
});


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

 function cleanDate(aDate){
   dd = String(aDate.getDate()).padStart(2, '0');
   mm = String(aDate.getMonth() + 1).padStart(2, '0'); //January is 0!
   yyyy = aDate.getFullYear();
   let newCleanDate = yyyy + '-' + mm + '-' + dd;
   return newCleanDate;
 }

function numberWithCommas(x) {
   return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function populateRates(){
let mortalRate = null;
let survRate = null;
let activeCases = null;

mortalRate = (totalDeaths/totalCases)*100
mortalRate = Math.round(mortalRate)
survRate = (totalRecovered/totalCases)*100
survRate = Math.round(survRate)

activeCases = totalCases - totalRecovered
mortRate.innerHTML = ("Mortality rate " +mortalRate + "%")
surRate.innerHTML= ("Survival rate " + survRate + "%")
active.innerHTML = (numberWithCommas(activeCases) + " active")
   
}


 