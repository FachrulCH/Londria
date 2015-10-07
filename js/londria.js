// Initialize app
//var LDR = new Framework7();
var LDR = new Framework7({
    modalTitle: "Londria",
    material: true,
    materialPageLoadDelay: 200,
    sortable: false,
    pushState: true,
    pushStateSeparator: '#fch/',
    precompileTemplates: true
});

// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

// default nilai variabel global jika belum di definisikan
// setting di file js/config.js
var CONFIG = CONFIG || {};

// Add view
var mainView = LDR.addView('.view-main', {
});

// Option 1. Using page callback for page (for "about" page in this case) (recommended way):
LDR.onPageInit('index', function (page) {
    // Do something here for page
    LDR.alert("Hai coy");

});

LDR.onPageInit('layanan', function (page) {
    // Ambil data layanan dari server
    $$.post(CONFIG.url+'/layanan.json', {}, function (data) {
        var layananHTML = Template7.templates.layananTemplate(JSON.parse(data));
        $$('#targetId').html(layananHTML);
    });
});

LDR.onPageAfterAnimation('layanan', function (page) {
    
    // event klik ga berlaku kalo di definisikan sebelum node ada di dalam DOM
    // Makanya Pasang event listener setelah template7 merender kedalam DOM
    $$('.cartTambah').on('click', function () {
        // ketika icon (+) di klik maka akan bertambah jumlah nya
        var subQty = $$(this).parents('.cardLayanan').find('.subQty');
        var qty = parseInt(subQty.text());
        var layananHarga = $$(this).parents('.cardLayanan').find('.layananHarga');
        var harga = layananHarga.text();
        var subTotal = $$(this).parents('.cardLayanan').find('.subTotal');

        var newQty = qty + 1;
        var newSubHarga = harga * newQty;

        subQty.text(newQty);
        subTotal.text("Rp" + newSubHarga);
        tambahCart();
    });

    $$('.cartKurang').on('click', function () {
        LDR.alert("Kurang");
    });

});


LDR.onPageInit('layananDetail', function (page) {
    setTimeout(function(){
    var text =
            '{ "employees" : [' +
            '{ "firstName":"Alul" , "lastName":"FCH" },' +
            '{ "firstName":"Bahur" , "lastName":"HDY" },' +
            '{ "firstName":"Cecep" , "lastName":"PEA" } ]}';
    var datanya = JSON.parse(text);

    // Render person template to HTML, its template is already compiled and accessible as Template7.templates.personTemplate
    var personHTML = Template7.templates.personTemplate(datanya);
    $$('#dataTmpl').html(personHTML);
},8000);
});

LDR.onPageInit('profil', function (page) {
    // ambil data dari localStorage
    var storedData = LDR.formGetData('#form_profil');
    if (storedData) {
        //alert(JSON.stringify(storedData));
        //masukan data json ke dalam form
        LDR.formFromJSON('#form_profil', storedData);
    }

    $$('.btn_simpanForm').on('click', function () {
        var formData = LDR.formToJSON('#form_profil');

        //simpan ke localStorage
        LDR.formStoreData('#form_profil', formData);
        LDR.alert("Data tersimpan");
    });

});

function tambahCart() {

    var badge = $$('.badge');
    var newBadge = parseInt(badge.text()) + 1;
    badge.text(newBadge);
}

function keBeranda() {
    mainView.router.loadPage('index.html');
}

function keLayanan() {
    mainView.router.loadPage('pg-layanan.html');
}