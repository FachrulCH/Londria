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

var LDRswiper = LDR.swiper('.swiper-container', {
    pagination: '.swiper-pagination',
    paginationClickable: true,
    autoplay: 3000,
    speed: 1500,
    effect: "coverflow",
    spaceBetween: 10,
    preloadImages: false,
    lazyLoading: true
});

// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

// default nilai variabel global jika belum di definisikan
// setting di file js/config.js
var CONFIG = {
//    url: 'http://fachrul.net/londriaServer/',
//    imgProfil : 'http://fachrul.net/londriaServer/img/profile/'
    url: 'http://localhost/londriaServer/',
    imgProfil: 'http://localhost/londriaServer/img/profile/'
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
// setelah aplikasi di inisialisasi, ambil data layanan dari server
//======================================

// cek dlu klo belum ada ambil dari server
if (LDR.params.template7Data['page:pgLayanan'] === undefined || LDR.params.template7Data['page:pgLayanan'] === null)
{
    $$.post(CONFIG.url + '/layanan.json', {}, function (data)
    {
        LDR.params.template7Data['page:pgLayanan'] = JSON.parse(data);
    });
    console.log("get data layanan json");
}

Pengguna = {
    initialize: function ()
    {
        this.getFav();
    },
    getFav: function ()
    {
        // ambil data dari DB

        Pengguna.data = {
            favorit: [
                {
                    "id": 123,
                    "nama": "Laundry Asoy",
                    "posisi": {
                        "latitude": -6.1753871,
                        "longitude": 106.8249587
                    },
                    "alamat": "Rumahnya ini disini",
                    "buka": "Setiap hari, 09:00-22:00",
                    "foto": CONFIG.imgProfil + "avatar.png",
                    "desc": "Ini adalah deskripsi",
                    "layanan": [
                        {"id": 1234,
                            "nama": "cuci",
                            "foto": ".jpg",
                            "harga": 10000
                        },
                        {"id": 2222,
                            "nama": "gosok",
                            "foto": ".jpg",
                            "harga": 10000
                        }
                    ]
                },
                {
                    "id": 2222,
                    "nama": "Laundry Geboy",
                    "posisi": {
                        "latitude": -6.1594736,
                        "longitude": 106.7853433
                    },
                    "alamat": "Jl. alamat laundry geboy euy",
                    "buka": "Setiap hari, 09:00-22:00",
                    "foto": CONFIG.imgProfil + "avatar2.png",
                    "desc": "Ini adalah deskripsi",
                    "layanan": [
                        {"id": 1234,
                            "nama": "cuci",
                            "foto": ".jpg",
                            "harga": 10000
                        },
                        {"id": 2222,
                            "nama": "gosok",
                            "foto": ".jpg",
                            "harga": 10000
                        }
                    ]
                }
            ],
            lokasi: {
                "latitude": -6.2036776,
                "longitude": 106.8214523
            }
        };


        // Hitung jarak laundry dengan posisi sekarang
        $$.each(Pengguna.data.favorit, function (index, value)
        {
            Pengguna.data.favorit[index].jarak = Math.round(haversine(Pengguna.data.lokasi, Pengguna.data.favorit[index].posisi));
        });


        LDR.params.template7Data['page:pgLaundry'] = Pengguna.data;
    }
};

Pengguna.initialize();

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
    tambah: function (that)
    {
        var Barangnih = new Barang();
        Barangnih.getProp(that);
        Barangnih.doing('tambah');
        window.barangnya = Barangnih.isi();

        func_replaceBarang(barangnya);
        //console.log("barangnya" +barangnya);
    },
    kurang: function (that)
    {
        var Barangnih = new Barang();
        Barangnih.getProp(that);
        Barangnih.doing('kurangi');
        window.barangnya = Barangnih.isi();

        func_replaceBarang(barangnya);
    },
    refresh: function ()
    {
        var badge = $$('.KRJtotal');
        //console.log(badge);
        badge.text(parseInt(Keranjang.totalQty));
        if (Keranjang.totalQty === 0)
        {
            var badge = $$('.keKeranjang').hide();
        } else
        {

            if ($$('.keKeranjang').css('display') === 'none')
            {
                $$('.keKeranjang').show();
            }
        }
    },
    simpan: function ()
    {
        db.setItem('keranjang', Keranjang).then(
                LDR.alert("berhasil tersimpan")
                );
    },
    reload: function ()
    {
        var barangDlmKeranjang = Keranjang.barang;
        $$.each(barangDlmKeranjang, function (index, value)
        {
            var barang = new Barang();
            barang.getFromBarang(barangDlmKeranjang[index]);
            barang.setLabel();
        });

    }
};


var Barang = function ()
{
    this.selector;
    this.idLayanan;
    this.hargaSatuan;
    this.subTotal;
    this.subQty;
};

Barang.prototype.doing = function (operator)
{
    if (operator === 'tambah')
    {
        this.subQty += 1;
        this.subTotal = this.hargaSatuan * this.subQty;
        this.setLabel();
        Keranjang.totalQty += 1;
        //console.log("tambah dari"+this.isi());
        return "ditambahkan";
    } else
    {
        this.subQty -= 1;
        if (this.subQty < 0)
        {
            LDR.alert("Keranjang anda kosong");
            return false;
        }
        this.subTotal = this.hargaSatuan * this.subQty;
        this.setLabel();
        Keranjang.totalQty -= 1;
        return "dikurangi";
    }
};
Barang.prototype.getProp = function (that)
{
    this.selector = $$(that).parents('.cardLayanan');
    this.idLayanan = this.selector.data('idLayanan');
    this.hargaSatuan = func_rpNum(this.selector.find('.layananHarga').text());//parseInt(this.selector.find('.layananHarga').text());
    this.subQty = parseInt(this.selector.find('.subQty').text());
};
Barang.prototype.setLabel = function ()
{
    this.selector.find('.subQty').text(this.subQty);    //==> update label
    this.selector.find('.subTotal').text(this.subTotal); //==> update label (hiden)
    this.selector.find('.subTotal2').text(func_numRp(this.subTotal)); //==> update label (format Rp)
};

Barang.prototype.getFromBarang = function (barang)
{
    this.selector = $$('[data-idLayanan="' + barang.idLayanan + '"]');
    this.idLayanan = barang.idLayanan;
    this.hargaSatuan = barang.hargaSatuan;
    this.subTotal = barang.subTotal;
    this.subQty = barang.subQty;
};

// untuk masuk ke objek keranjang
Barang.prototype.isi = function ()
{
    return{
        idLayanan: this.idLayanan,
        hargaSatuan: this.hargaSatuan,
        subTotal: this.subTotal,
        subQty: this.subQty
    };
};



/*************************************
 Function
 *************************************/

function keLayanan()
{
    mainView.router.loadPage('pg-layanan.html');
}

//function to remove a value from the json/array
function hapusArray(obj, prop, val)
{
    var c, found = false;
    for (c in obj)
    {
        if (obj[c][prop] === val)
        {
            found = true;
            break;
        }
    }
    if (found)
    {
        //delete obj[c]; malah undefined
        obj.splice(c, 1);
    }
}

function func_replaceBarang(Barang)
{
    var idLay = Barang.idLayanan;
    //hapus barang dari keranjang
    hapusArray(Keranjang.barang, 'idLayanan', idLay);

    //masukan barang ke keranjang lagi
    if (Barang.subQty > 0)
    {
        Keranjang.barang.push(Barang);
    }
}

function pop_OpsiPromo(that)
{
    //myApp.popover(popover, target)
    LDR.popover('.popover_promo', that);
}

function func_numRp(angka)
{
    return numeral(angka).format('$0,0');
}

function func_rpNum(rp)
{
    return numeral().unformat(rp);
}

function func_timeRel(time)
{
    return moment(time).fromNow();
}

var rating = new Array();
rating[0] = '<span class="fa fa-star-o"></span><span class="fa fa-star-o"></span><span class="fa fa-star-o"></span><span class="fa fa-star-o"></span><span class="fa fa-star-o"></span>';
rating[1] = '<span class="fa fa-star"></span><span class="fa fa-star-o"></span><span class="fa fa-star-o"></span><span class="fa fa-star-o"></span><span class="fa fa-star-o"></span>';
rating[2] = '<span class="fa fa-star"></span><span class="fa fa-star"></span><span class="fa fa-star-o"></span><span class="fa fa-star-o"></span><span class="fa fa-star-o"></span>';
rating[3] = '<span class="fa fa-star"></span><span class="fa fa-star"></span><span class="fa fa-star"></span><span class="fa fa-star-o"></span><span class="fa fa-star-o"></span>';
rating[4] = '<span class="fa fa-star"></span><span class="fa fa-star"></span><span class="fa fa-star"></span><span class="fa fa-star"></span><span class="fa fa-star-o"></span>';
rating[5] = '<span class="fa fa-star"></span><span class="fa fa-star"></span><span class="fa fa-star"></span><span class="fa fa-star"></span><span class="fa fa-star"></span>';

//======================================
// Meload JavaScript di page tertentu
// LDR.onPageInit('namaDataPage', function (page) {})
//======================================

//We can also add callback for all pages:
LDR.onPageBeforeAnimation('*', function (page)
{
    console.log("on *");
    if (Keranjang.totalQty === 0)
    {

        //Jika keranjang kosong/baru masuk menu, ambil data dari db, tabel keranjang
        db.getItem('keranjang').then(function (value)
        {
            if (value !== null)
            {
                Keranjang = value; // masukan data db ke objek keranjang
                console.log("ambil data dari db");
            }
        }).catch(function (err)
        {
            // oh noes! we got an error
            console.log(err);
        });
    }
    setTimeout(function ()
    {
        KeranjangCTL.refresh();
    }, 10);

    // format ke rupiah untuk class toNumeral
    $$('.toNumeral').each(function (index, elm)
    {
        var angka = $$(elm);
        var rp = func_numRp(angka.text());
        angka.text(rp);
        //console.log("Jadikan rupiah");
    });
});


//======================================
//              index.html
//======================================

LDR.onPageInit('index', function (page)
{
    // inisialisasi ulang swiper
    var LDRswiper = LDR.swiper('.swiper-container', {
        pagination: '.swiper-pagination',
        paginationClickable: true,
        autoplay: 3000,
        speed: 1500,
        effect: "coverflow",
        spaceBetween: 10,
        preloadImages: false,
        lazyLoading: true
    });
});


//======================================
//              pg-layanan.html
//======================================

LDR.onPageInit('pgLayanan', function (page)
{

    KeranjangCTL.reload();

    $$('.KRJtambah').on('click', function ()
    {
        KeranjangCTL.tambah(this);
        KeranjangCTL.refresh();
    });

    $$('.KRJkurang').on('click', function ()
    {
        KeranjangCTL.kurang(this);
        KeranjangCTL.refresh();
    });

//    $$.each($$('.toNumeral'), function (index, value) {
//            numeral(1000).format('$0,0');
//        });



});

LDR.onPageBeforeRemove('pgLayanan', function (page)
{
    //LDR.alert("proses save");
    console.log("proses save disini");
});

//======================================
LDR.onPageInit('pgProfil', function (page)
{
    // ambil data dari localStorage
    var storedData = LDR.formGetData('#form_profil');
    if (storedData)
    {
        //alert(JSON.stringify(storedData));
        //masukan data json ke dalam form
        LDR.formFromJSON('#form_profil', storedData);
    }

    $$('.btn_simpanForm').on('click', function ()
    {
        var formData = LDR.formToJSON('#form_profil');

        //simpan ke localStorage
        LDR.formStoreData('#form_profil', formData);
        LDR.alert("Data tersimpan");
    });

});

//======================================
//              pg-keranjang.html
//======================================
LDR.onPageInit('pgKeranjang', function (page)
{
    // untuk menentukan listitem mana yg di klik tidak bisa menggunakan variabel 'this'
    // karena .itemHapus berada di index.html, bukan di dalam list tersebut
    // jadi perlu di tampund di suatu variabel dalam pg-keranjang ini

    var itemId = "";
    var itemIni = "";

    $$('.popOpsi').on('click', function ()
    {
        //overite variabel global itemId
        itemId = $$(this).parents('.item-content').find('.item-title').text();
        itemIni = $$(this).parents('.item-content');

        //console.log(itemId);
        var clickedLink = this;
        LDR.popover('.popoverOpsi', clickedLink);
    });

    // class ItemHapus adanya di index.html
    $$('.itemHapus').on('click', function ()
    {

        LDR.closeModal(); // menutup popoverOpsi
        LDR.confirm('Apakah kamu yakin?', 'Hapus Item',
                function ()
                {
                    itemIni.hide(); //proses hapus
                    LDR.alert(itemId + ' Dihapus');
                },
                function ()
                {
                    LDR.alert('You clicked Cancel button');
                }
        );
    });


    $$('.itemUbahJum').on('click', function ()
    {
        LDR.closeModal(); // menutup popoverOpsi

        // dibuat timeout agar syncronus setelah elemen muncul
        setTimeout(function ()
        {
            pickerDevice.open();
        }, 10);


    });

    // navigasi tab
    $$('.floating-button').on('click', function ()
    {
        var tabSkrg = $$('.tab-link.active').text();

        if (tabSkrg === "Keranjang")
        {
            LDR.showTab("#tab_alamat");
        } else if (tabSkrg === "Alamat")
        {
            LDR.showTab("#tab_konfirmasi");
        }

    });


    //    var sysdate = new Date();
//
    // membuat picker Jumlah
    var pickerDevice = LDR.picker({
        cols: [
            {
                textAlign: 'center',
                values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
            }
        ],
        onClose: function (p)
        {
            var nilai = p.value;
            // setelah di dapat nilai baru

            //console.log(nilai);
            // masukan nilai baru ke element jumlah/update database
            itemIni.find('.itemQty').text(nilai);

        }
    });
//
//    // Membuat tanggal
//    var kalender = LDR.calendar({
//        input: '.itemKalender',
//        toolbarCloseText: 'Pilih',
//        minDate: sysdate.setDate(sysdate.getDate() - 1), //minimum hari ini
//        maxDate: sysdate.setDate(sysdate.getDate() + 30)
//    });

});


//======================================
//              pg-laundry-profil.html
//======================================
LDR.onPageBeforeInit('pgLaundryProfil', function (page)
{
    // dibuat objek penampung nilai biar setelah ngambil ajax dari database, ga langsung di manipulasi DOM
    // insert ke DOM di lakukan saat tab nya di klik ajah
    // dibuat flaging 0 untuk belum di insert ke DOM, 1 = udah di insert ke DOM
    window.pgLaundryProfil = {tab_profil: 0, tab_lokasi: 0, tab_layanan: 0, tab_komentar: 0};

    function data2view(data)
    {
        //console.log("func data2view:"+JSON.stringify(data));
        $$('.txt_namaLdr').text(data.nama);
        $$('.txt_jamBuka').text(data.buka);
        $$('.txt_desc').text(data.desc);
        $$('.txt_alamat').text(data.alamat);
        $$('#img_profilLondri').css('background-image', 'url(' + data.foto + ')');
        window.pgLaundryProfil.tab_profil = 1; // uda insert ke DOM
    }


    $$.ajax({
        url: CONFIG.url + "api/profil/laundry/2/",
        method: 'GET',
        dataType: 'json',
        data: {},
        beforeSend: function (xhr)
        {
            LDR.showPreloader();
        },
        success: function (data, textStatus, jqXHR)
        {
            //LDR.alert("Berhasil");
            window.pgLaundryProfil.data = data.profil;
            data2view(data.profil);
            //console.log(data);
        },
        error: function (jqXHR, textStatus, errorThrown)
        {
            LDR.alert("Terdapat error saat mengambil data dari server");
            console.log("Terdapat error saat mengambil data dari server: " + errorThrown);
        },
        complete: function (jqXHR, textStatus)
        {
            LDR.hidePreloader();
        }
    });
    $$('#tab_lokasi').on('show', function ()
    {
        console.log("tab_lokasi muncul");
    });


    $$('#tab_layanan').on('show', function ()
    {
        if (window.pgLaundryProfil.tab_layanan === 0) // jika tab layanan belum di insert DOM
        {
            //console.log("belom di insert layanan");
            var listLayanan = "";
            $$.each(window.pgLaundryProfil.data.layanan, function (index, value)
            {
                var row = window.pgLaundryProfil.data.layanan[index];
                listLayanan += '<li class="item-content">'
                        + '<div class="item-media"><img src="' + row.foto + '" width="44"/></div>'
                        + '<div class="item-inner">'
                        + '<div class="item-title-row">'
                        + '<div class="item-title">' + row.nama + '</div>'
                        + '</div>'
                        + '<div class="item-subtitle">' + row.harga + '</div>'
                        + '</div>'
                        + '</li>';
            });

            $$('#txt_listLayanan').html(listLayanan);
            window.pgLaundryProfil.tab_layanan = 1;
        }
    });

    $$('#tab_komentar').on('show', function ()
    {
        if (window.pgLaundryProfil.tab_komentar === 0) // jika tab komentar belum di insert DOM
        {
            console.log("tab_komentar muncul");
            var listKomen = "";
            $$.each(window.pgLaundryProfil.data.komentar, function (index, value)
            {
                var row = window.pgLaundryProfil.data.komentar[index];
                listKomen += '<div class="card facebook-card">'
                        + '<div class="card-header">'
                        + '<div class="facebook-avatar"><img src="'+ row.foto +'" class="avaBunder" width="34" height="34"></div>'
                        + '<div class="facebook-name">'+ row.sender +'</div>'
                        + '<div class="facebook-date">' + func_timeRel(row.time) + '</div>'
                        + '</div>'
                        + '<div class="card-content">'
                        + '<div class="card-content-inner">'
                        + '<p>'
                        + rating[row.rating]
                        + '</p>'
                        + '<p class="color-gray">'+ row.message +'</p>'
                        + '</div>'
                        + '</div>'
                        + '</div>';
            });
            $$('#txt_listKomen').html(listKomen);
            window.pgLaundryProfil.tab_komentar = 1;
        }
    });
});


LDR.onPageBeforeRemove('pgLaundryProfil', function (page)
{
    window.pgLaundryProfil = undefined;
    console.log("Menghapus window.pgLaundryProfil");
});