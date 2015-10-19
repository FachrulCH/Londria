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

// alias buat localforage
//http://mozilla.github.io/localForage/
var db = localforage || {};
db.config({
    name: 'dbLondria'
});

//====================================== 
//         Class Variabel
//======================================

// Konstruktor model
window.Keranjang = {
    "userId": "001",
    "totalQty": 0,
    "totalHarga": 0,
    "barang": [],
    "penjemputan": {
        "alamat": "",
        "jam": ""
    },
    "pengantaran": {
        "alamat": "",
        "jam": ""
    }
};

    
// method controler
var KeranjangCTL = {
    tambah: function(that){
        var Barangnih = new Barang();
        Barangnih.getProp(that);
        Barangnih.doing('tambah');
        window.barangnya = Barangnih.isi();
        
        replaceBarang(barangnya);
        //console.log("barangnya" +barangnya);
    },
    kurang: function (that){
        var Barangnih = new Barang();
        Barangnih.getProp(that);
        Barangnih.doing('kurangi');
        window.barangnya = Barangnih.isi();
        
        replaceBarang(barangnya);
    },
    refresh: function (){
        var badge = $$('.KRJtotal');
        //console.log(badge);
        badge.text(parseInt(Keranjang.totalQty));
        if (Keranjang.totalQty === 0){
            var badge = $$('.keKeranjang').hide();
        }else{
        
            if($$('.keKeranjang').css('display') === 'none'){ 
                $$('.keKeranjang').show();
             }
        }
    },
    simpan: function (){
        db.setItem('keranjang', Keranjang).then(
                LDR.alert("berhasil tersimpan")
                );
    },
    reload: function(){
        var barangDlmKeranjang = Keranjang.barang;
        $$.each(barangDlmKeranjang, function (index, value){
            var barang = new Barang();
            barang.getFromBarang(barangDlmKeranjang[index]);
            barang.setLabel();
        });
        
    }
};


var Barang = function(){
    this.selector;
    this.idLayanan;
    this.hargaSatuan;
    this.subTotal;
    this.subQty;
    };
    
Barang.prototype.doing    = function (operator){
    if(operator === 'tambah'){
        this.subQty += 1;
        this.subTotal = this.hargaSatuan * this.subQty;
        this.setLabel();
        Keranjang.totalQty += 1;
        //console.log("tambah dari"+this.isi());
        return "ditambahkan";
    }else{
        this.subQty -= 1;
        if (this.subQty < 0){
            LDR.alert("Keranjang anda kosong");
            return false;
        }
        this.subTotal = this.hargaSatuan * this.subQty;
        this.setLabel();
        Keranjang.totalQty -= 1;
        return "dikurangi";
    }
};
Barang.prototype.getProp = function(that){
    this.selector           = $$(that).parents('.cardLayanan');
    this.idLayanan          = this.selector.data('idLayanan');
    this.hargaSatuan        = parseInt(this.selector.find('.layananHarga').text());
    this.subQty             = parseInt(this.selector.find('.subQty').text());
};
Barang.prototype.setLabel = function(){
    this.selector.find('.subQty').text(this.subQty);    //==> update label
    this.selector.find('.subTotal').text(this.subTotal); //==> update label
};

Barang.prototype.getFromBarang = function(barang){
    this.selector       = $$('[data-idLayanan="'+ barang.idLayanan +'"]');
    this.idLayanan      = barang.idLayanan;
    this.hargaSatuan    = barang.hargaSatuan;
    this.subTotal       = barang.subTotal;
    this.subQty         = barang.subQty;
};

// untuk masuk ke objek keranjang
Barang.prototype.isi = function(){
    return{
      idLayanan: this.idLayanan,
      hargaSatuan:this.hargaSatuan,
      subTotal: this.subTotal,
      subQty: this.subQty
    };
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

//We can also add callback for all pages:
LDR.onPageBeforeAnimation('*', function (page) {
    console.log("semuanya");
    if (Keranjang.totalQty === 0) {
        //Jika keranjang kosong/baru masuk menu, ambil data dari db
        db.getItem('keranjang').then(function (value) {
            if (value !== null){
                Keranjang = value; // malukan data db ke objek keranjang
                console.log("keranjang ada isi" + value);
            }
            //console.log("kosong keranjang" + value);
        }).catch(function (err) {
            // oh noes! we got an error
            console.log(err);
        });
    }
    setTimeout(function () {
        KeranjangCTL.refresh();
    }, 100);
});

LDR.onPageInit('index', function (page) {
    // Do something here for page
    LDR.alert("Hai coy");

});

//================== pgLayanan ====================

LDR.onPageInit('pgLayanan', function (page) {

    KeranjangCTL.reload();
    
    $$('.KRJtambah').on('click', function () {
        KeranjangCTL.tambah(this);
        KeranjangCTL.refresh();
    });
    
    $$('.KRJkurang').on('click', function () {
        KeranjangCTL.kurang(this);
        KeranjangCTL.refresh();
    });
});

LDR.onPageBeforeRemove('pgLayanan', function (page) {
    //LDR.alert("proses save");
    console.log("save disini");
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

function keBeranda() {
    mainView.router.loadPage('index.html');
}

function keLayanan() {
    mainView.router.loadPage('pg-layanan.html');
}

//function to remove a value from the json/array
function hapusArray(obj, prop, val) {
    var c, found=false;
    for(c in obj) {
        if(obj[c][prop] === val) {
            found=true;
            break;
        }
    }
    if(found){
        //delete obj[c]; malah undefined
        obj.splice(c, 1);
    }
}

function replaceBarang(Barang){
    var idLay = Barang.idLayanan;
    //hapus barang dari keranjang
    hapusArray(Keranjang.barang,'idLayanan',idLay);
    
    //masukan barang ke keranjang lagi
    if(Barang.subQty > 0){
        Keranjang.barang.push(Barang);
    }
}