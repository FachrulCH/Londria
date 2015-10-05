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
  // Do something here for page
  LDR.alert("Hai coy");
  
});

LDR.onPageInit('layanan', function (page) {
  
  $$('.cartTambah').on('click',function (){
      // ketika icon (+) di klik maka akan bertambah jumlah nya
     var subQty = $$(this).parents('.cardLayanan').find('.subQty');
     var qty = parseInt(subQty.text());
     var layananHarga = $$(this).parents('.cardLayanan').find('.layananHarga');
     var harga = layananHarga.text();
     var subTotal = $$(this).parents('.cardLayanan').find('.subTotal');
     
     var newQty = qty + 1;
     var newSubHarga = harga * newQty;
     
      subQty.text(newQty);
      subTotal.text("Rp"+newSubHarga);
      tambahCart();
  });
  
  $$('.cartKurang').on('click',function (){
     LDR.alert("Kurang"); 
  });
  
});

function tambahCart(){
    
    var badge = $$('.badge');
    var newBadge = parseInt(badge.text())+1;
    badge.text(newBadge);
}

function keBeranda(){
    mainView.router.loadPage('index.html');
}

function keLayanan(){
    mainView.router.loadPage('pg-layanan.html');
}