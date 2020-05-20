class SummaryData{

   constructor(url){
       this.url = url
   }
   //Method fetch global stats, this is uses to pop country drop down
    async getAllCountries(){
           const response = await fetch(this.url);
           const summaryData = await response.json();
           
            summaryData.Countries.forEach(Countries => {
              
               if(Countries.Slug === 'united-states'){
                  searchCountry.options[searchCountry.options.length] = new Option('United States of America', 'united-states', true,true)
           
               }else{
                  searchCountry.options[searchCountry.options.length] = new Option(Countries.Country, Countries.Slug);
               }
            });
            return "countries loaded";
   };
    
}

class StateList{

   constructor(url){
       this.url = url
   }
   //Method fetch stats list 
    async getAllStates(){
           const response = await fetch(this.url);
           var summaryData = await response.json();
           var arrayOfStates = [];
           
           summaryData.forEach(Province => {
            
                arrayOfStates.push(Province.Province);
            });
            //remove duplicates
            arrayOfStates = arrayOfStates.filter((a, b) => arrayOfStates.indexOf(a) === b)
            
            //Sort
            arrayOfStates = arrayOfStates.sort();
            searchStateSelect.options[searchStateSelect.options.length] = new Option('', '', true,true);
            arrayOfStates.forEach(arrayOfStates =>{
               //add to select state list box
               
               searchStateSelect.options[searchStateSelect.options.length] = new Option(arrayOfStates);
            })

            return "states loaded";
      
    };
 
}

class RecordSet{
  
   constructor(url){
      this.url = url
      this.summaryData = null;
  }
  async collectData(){
   var response = await fetch(this.url);
   var summaryData = await response.json();
   this.summaryData = summaryData;
   return summaryData;
  }
  
  async getCasesPerState(){
   //var response = await fetch(this.url);
   //var summaryData = await response.json();
   let casesToday = null;
   let casesYesterday = null;
   let today = null;
   let theDayBefore = null;
   let aDate  = fromWhen.value;
      
   this.summaryData.forEach(country => {
      
      if(country.Province === searchStateSelect.value){
         
         
        today = new Date(country.Date);
        today.setDate(today.getDate() + 1);//sets to today
        today = cleanDate(today);
        
        theDayBefore  = new Date(aDate);
        theDayBefore  = cleanDate(theDayBefore);
        
       if(today === aDate ) {
         casesToday =  casesToday + country.Cases
         casesToday = Number(casesToday)
       }
       if(today === theDayBefore ) {
         casesYesterday =  casesYesterday + country.Cases
         casesToday = Number(casesToday)
       }
       

      }
   })

   return {CasesToday: `${casesToday}`, CasesYesterday: `${casesYesterday}`, };

  }

   
  //get data for county
   async getCasesPerCounty(){
   //var response = await fetch(this.url);
   //var summaryData = await response.json();
   let casesToday = null;
   let casesYesterday = null;
   let today = null;
   let theDayBefore = null;
   let aDate  = fromWhen.value;
   
   this.summaryData.forEach(country => {
    if(country.Province === searchStateSelect.value){
      
      if (country.City === searchCountySelect.value){
         
          today = new Date(country.Date);
          today.setDate(today.getDate() + 1);//sets to today
          today = cleanDate(today);
        
          theDayBefore  = new Date(aDate);
       
          theDayBefore  = cleanDate(theDayBefore);
        
         if(today === aDate ) {
            casesToday =  casesToday + country.Cases
            casesToday = Number(casesToday)
         }
         if(today === theDayBefore ) {
           casesYesterday =  casesYesterday + country.Cases
           casesToday = Number(casesToday)
         }
       }

    }
   })

   return {CountyCases: "County Cases", CasesToday: `${casesToday}`, CasesYesterday: `${casesYesterday}`, };

  }





  //get data for country
  async getCasesPerCountry(){
   var response = await fetch(this.url);
   var summaryData = await response.json();
   let casesToday = null;
   let casesYesterday = null;
   let today = null;
   let yesterday = null;
   let theDayBefore = null;
   let aDate  = fromWhen.value;
   let countrySelectText = searchCountry.options[searchCountry.selectedIndex];
   
   
   summaryData.forEach(country => {
      
    if(country.Country === countrySelectText.text){
         
          today = new Date(country.Date);
          today.setDate(today.getDate() + 1);//sets to today
          today = cleanDate(today);
        
          theDayBefore  = new Date(aDate);
       
          theDayBefore  = cleanDate(theDayBefore);
        
         if(today === aDate ) {
            casesToday =  casesToday + country.Cases
            casesToday = Number(casesToday)
         }
         if(today === theDayBefore ) {
           casesYesterday =  casesYesterday + country.Cases
           casesToday = Number(casesToday)
         }
       

    }
   })

   return {CountryCases: "Country Cases", CasesToday: `${casesToday}`, CasesYesterday: `${casesYesterday}`, };

  }
  
}

class SlugMaker{

   constructor(caseType, live, dayOne){
      
      this.country = searchCountry.value
      this.date = fromWhen.value
      this.caseType = caseType
      this.live = live
      
  
  }

  returnUrl(){
  //https://api.covid19api.com/live/country/south-africa/status/confirmed?from=2020-03-01T00:00:00Z&to=2020-04-01T00:00:00Z
  //https://api.covid19api.com/country/south-africa/status/confirmed?from=2020-03-01T00:00:00Z&to=2020-04-01T00:00:00Z
  // Example get request
  let newUrlWithSlug = '';
  let oldUrl = 'https://api.covid19api.com/';
  let liveTag = ""
  if (this.live){ liveTag = "live/";}//if this.live = true then use this tag
  let countryTag = "country/";
  let selectedCountry = this.country;
  
  let today = new Date(this.date);//converts to real date to find day before
  let yesterday = new Date(today-1);//gets yesterday based on today value
  today = this.date; //reasigns today to be a clean value
  yesterday = cleanDate(yesterday);// cleans yesterday so they are both usable now
  if (this.live){ 
     var trueToday = new Date()
     trueToday = cleanDate(trueToday)
     today = trueToday;
   }
  let statusTag = '/status/';
  let typeOfCase = this.caseType;
  let beforeDate = "?from="
  let FirstTimeTag = 'T00:00:00Z&to='
  let secondTimeTag = 'T23:59:59Z'
  //let slug = null;
  //slug = searchCountry.options[searchCountry.selectedIndex].value;

  
   newUrlWithSlug = oldUrl + liveTag + countryTag + selectedCountry + statusTag + typeOfCase + beforeDate + yesterday + FirstTimeTag + today + secondTimeTag;

   

   console.log(newUrlWithSlug)
   return newUrlWithSlug;
  }


}

class UI{
      constructor(){
            this.newCases = null
            this.totalCases = null
            this.newDeaths = null
            this.totalDeaths = null
            this.recovered = null
      }

      setCases(answerObj){
         
         this.newCases = answerObj.CasesToday
         this.totalCases = answerObj.CasesYesterday
         if(this.newCases>this.totalCases)
         {this.newCases =this.newCases-this.totalCases}
         else{
            this.newCases=0
         }
         
         
         let thePlace = findThePlace();
              
           if(!this.newCases || this.newCases === "null"){this.newCases = "No data this day."
           } else{this.newCases = numberWithCommas(this.newCases)}
           
                           
           NewConfirmed.innerHTML = `New confirmed cases in ${thePlace} (${this.newCases})`
           totalCases = this.totalCases
           if(!this.totalCases || this.totalCases === "null"){this.totalCases = "No data this day."
           } else{this.totalCases = numberWithCommas(this.totalCases)}
                   
           TotalConfirmed.innerHTML = `Total confirmed cases ${thePlace} (${this.totalCases})`
           areStatsPopulated()
           
         
      }

      setDeaths(answerObj){
         
         this.newDeaths = answerObj.CasesToday
         this.totalDeaths = answerObj.CasesYesterday
         if(this.newDeaths>this.totalDeaths)
         {this.newDeaths =this.newDeaths-this.totalDeaths}
         else{
            this.newDeaths=0
         }
         
         let thePlace = findThePlace();
         
         if(!this.newDeaths || this.newDeaths === "null"){this.newDeaths = "No data this day."
         }else{this.newDeaths = numberWithCommas(this.newDeaths)}

         NewDeaths.innerHTML = `New confirmed deaths in ${thePlace} (${this.newDeaths})`
         
         totalDeaths = this.totalDeaths;
         if(!this.totalDeaths || this.totalDeaths === "null"){this.totalDeaths = "No data this day."
         }else{this.totalDeaths = numberWithCommas(this.totalDeaths)}
         
         TotalDeaths.innerHTML = `Total confirmed deaths in ${thePlace} (${this.totalDeaths})`
         areStatsPopulated()
         
      }

      setRecovered(answerObj){
         this.recovered = answerObj.CasesToday
         
         totalRecovered = this.recovered        
         if(!this.recovered || this.recovered === "null"){this.recovered = "No data this day."
         }else{this.recovered = numberWithCommas(this.recovered)}
         
         let thePlace = findThePlace();
         NewRecovered.innerHTML = `Confirmed recoveries in ${thePlace} (${this.recovered})`
         areStatsPopulated()
      }
            
      
      
}