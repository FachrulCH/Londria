// Initialize app
//======================================
//         variabel awal
//======================================
var LDR = new Framework7({
    modalTitle: "Londria",
    material: true,
    materialPageLoadDelay: 200,
    sortable: false,
    pushState: true,
    pushStateSeparator: '#fch/',
    //precompileTemplates: true
    template7Pages: true // enable Template7 rendering for Ajax and Dynamic pages
});

// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

// default nilai variabel global jika belum di definisikan
// setting di file js/config.js
var CONFIG = {
  url: 'http://localhost/londriaServer'
};

// Add view
var mainView = LDR.addView('.view-main', {});

//====================================== 
//         Class Variabel
//======================================
window.Keranjang = {
   stok: 0,
   tambah: function(qty){
       this.stok += qty;
       return "tambah";
   },
   kurang: function(qty){
       this.stok -= qty;
       return "kurang";
   }
};


//====================================== 
// setelah aplikasi di inisialisasi, ambil data layanan dari server
//======================================

// cek dlu klo belum ada ambil dari server
if (LDR.params.template7Data['page:pgLayanan'] === undefined || LDR.params.template7Data['page:pgLayanan'] === null){
    $$.post(CONFIG.url+'/layanan.json', {}, function (data) {
        LDR.params.template7Data['page:pgLayanan'] = JSON.parse(data);
    });
}

//======================================
// Meload JavaScript di page tertentu
// LDR.onPageInit('namaDataPage', function (page) {})
//======================================

LDR.onPageInit('index', function (page) {
    // Do something here for page
    LDR.alert("Hai coy");

});

//======================================
LDR.onPageInit('pgLayananDetail', function (page) {
    
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

//======================================
LDR.onPageInit('pgProfil', function (page) {
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

//======================================
LDR.onPageInit('pgKeranjang', function (page) {
    // untuk menentukan listitem mana yg di klik tidak bisa menggunakan variabel 'this'
    // karena .itemHapus berada di index.html, bukan di dalam list tersebut
    // jadi perlu di tampund di suatu variabel dalam pg-keranjang ini
    
    var itemId = "";
    var itemIni = "";
    var sysdate = new Date();
    
    // membuat picker Jumlah
    var pickerDevice = LDR.picker({
        cols: [
            {
                textAlign: 'center',
                values: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]
            }
        ],
        onClose: function(p){
            var nilai = p.value;
            // setelah di dapat nilai baru

            //console.log(nilai);
            // masukan nilai baru ke element jumlah/update database
            itemIni.find('.itemQty').text(nilai);
            
        }
    }); 
    
    // Membuat tanggal
    var kalender = LDR.calendar({
        input: '.itemKalender',
        dateFormat: 'D, dd-M-yyyy',
        toolbarCloseText: 'Pilih',
        minDate: sysdate.setDate(sysdate.getDate() - 1), //minimum hari ini
        maxDate: sysdate.setDate(sysdate.getDate() + 30)
    });
    
    
    
    $$('.popOpsi').on('click',function(){
        //overite variabel global itemId
        itemId = $$(this).parents('.item-content').find('.item-title').text();
        itemIni = $$(this).parents('.item-content');
        
        //console.log(itemId);
        var clickedLink = this;
        LDR.popover('.popoverOpsi', clickedLink);
    });
    
    // class ItemHapus adanya di index.html
    $$('.itemHapus').on('click', function () {
        
        LDR.closeModal(); // menutup popoverOpsi
        LDR.confirm('Apakah kamu yakin?', 'Hapus Item',
                function () {
                    itemIni.hide(); //proses hapus
                    LDR.alert(itemId +' Dihapus');
                },
                function () {
                    LDR.alert('You clicked Cancel button');
                }
        );
    });
    
    
    $$('.itemUbahJum').on('click',function(){
       LDR.closeModal(); // menutup popoverOpsi
       
       // dibuat timeout agar syncronus setelah elemen muncul
        setTimeout(function(){
            pickerDevice.open();
        },10);
        
        
    });
});


//======================================
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