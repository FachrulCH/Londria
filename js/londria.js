// Initialize app
//var LDR = new Framework7();
var LDR = new Framework7({
    modalTitle: "Londria",
    material: true,
    materialPageLoadDelay: 200
});

// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;
 
// Add view
var mainView = LDR.addView('.view-main', {
  
});

// Now we need to run the code that will be executed only for About page.
 
// Option 1. Using page callback for page (for "about" page in this case) (recommended way):
LDR.onPageInit('index', function (page) {
  // Do something here for "about" page
  LDR.alert("Hai coy");
  
});

