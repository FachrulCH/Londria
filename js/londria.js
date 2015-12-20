//======================================
//         Deklarasi Objek
//======================================
var app = {
    isPhonegap: function ()
    {
        return (typeof (cordova) !== 'undefined' || typeof (phonegap) !== 'undefined');
    },
    initialize: function ()
    {
        this.bindEvents();
    },
    bindEvents: function ()
    {
        if (app.isPhonegap()) {
            document.addEventListener('deviceready', this.onDeviceReady, false);
        } else {
            window.onload = this.onDeviceReady();
        }
    },
    onDeviceReady: function ()
    {
        console.log("ready gan");
        app.receivedEvent('deviceready');
    },
    receivedEvent: function (event)
    {
        switch (event)
        {
            case 'deviceready':
                app.inisiasi();
                break;
        }
    },
    inisiasi: function ()
    {
        // Initialize app
        //======================================
        //         variabel awal
        //======================================
        window.LDR = new Framework7({
            modalTitle: "Londria",
            material: true,
            materialPageLoadDelay: 200,
            sortable: false,
            pushState: true,
            pushStateSeparator: '#fch/',
            //precompileTemplates: true
            template7Pages: true // enable Template7 rendering for Ajax and Dynamic pages
        });

        window.LDRswiper = LDR.swiper('.swiper-container', {
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
        window.$$ = Dom7;

        // Add view
        window.mainView = LDR.addView('.view-main', {});
        
        // alias buat localforage
        //http://mozilla.github.io/localForage/
        window.db = localforage || {};
        db.config({
            name: 'dbLondria'
        });
        
        // cek dlu klo belum ada ambil dari server
        if (LDR.params.template7Data['page:pgLayanan'] === undefined || LDR.params.template7Data['page:pgLayanan'] === null) {
            //    $$.post(CONFIG.url + 'api/layanan/', {}, function (data)
            //    {
            //        console.log(data);
            //        LDR.params.template7Data['page:pgLayanan'] = JSON.parse(data.result_data);
            //    });

            $$.getJSON(URL.api + 'layanan/', {}, function (data)
            {
                LDR.params.template7Data['page:pgLayanan'] = data.result_data;
            });
            console.log("get data layanan json");
        }

    }
};

app.initialize();

window.$user = {
    profil: {
        "nama": "Kurawall",
        "no_tlp": "081111111",
        "email": "developer@email.com",
        "posisi": {
                    "latitude": -6.2036776,
                    "longitude": 106.8214523
                },
        "lokasi": [
            {
                "id": '1',
                "alamat": "jl alamat satu no 1",
                "koordinat": {
                    "latitude": -6.2036776,
                    "longitude": 106.8214523
                }
            }, {
                "id": '2',
                "alamat": "jl alamat satu no 2",
                "koordinat": {
                    "latitude": -6.2038776,
                    "longitude": 106.8214523
                }
            }
        ]
    },
    data: {
        "id": '',
        "name": '',
        "location": {"lat": '-6.1753871', "lng": '106.8249587'},
        "token": '12345678'
    },
    favorit: [],
    get_fav: function(){
         // ambil data dari DB
        if (LDR.params.template7Data['page:pgLaundry'] === undefined || LDR.params.template7Data['page:pgLaundry'] === null) {
            $user.favorit = [
                    {
                        "id": 123,
                        "nama": "Laundry Asoy",
                        "posisi": {
                            "latitude": -6.1753871,
                            "longitude": 106.8249587
                        },
                        "alamat": "Rumahnya ini disini",
                        "buka": "Setiap hari, 09:00-22:00",
                        "foto": URL.imgProfil + "avatar.png",
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
                        "foto": URL.imgProfil + "avatar2.png",
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
                ]
            };


            // Hitung jarak laundry dengan posisi sekarang
            $$.each($user.favorit, function (index, value)
            {
                $user.favorit[index].jarak = func_jarak($user.favorit[index].posisi);
            });


            LDR.params.template7Data['page:pgLaundry'] = {favorit: $user.favorit};
            console.log("getFav");
        }
    ,
    get_promo: function ()
    {
        if (LDR.params.template7Data['page:pgPromo'] === undefined || LDR.params.template7Data['page:pgPromo'] === null) {
            $$.getJSON(URL.api + 'promo/', {"token": $user.data.token}, function (data)
            {
                LDR.params.template7Data['page:pgPromo'] = data.result_data;
            });

            console.log("get data promo");
        }
    },
    initialize: function ()
    {
        this.get_fav();
        this.get_promo();
    }
};

$user.initialize();

var WS = {
    "result": {},
    "log": {},
    "post": function ($api, callback)
    {
        $$.ajax({
            url: URL.api + $api,
            method: 'POST',
            dataType: 'json',
            data: $user.data,
            beforeSend: function (xhr)
            {
                WS.result = null;
                LDR.showPreloader("Mohon Tunggu");
            },
            success: function (data, textStatus, jqXHR)
            {
                //console.log("datanyaaa WS"+ JSON.stringify(data));
                WS.result = data;
                WS.log = {"textStatus": textStatus, "jqXHR": jqXHR};
                //console.log("datanya ws: "+ JSON.stringify(data));

                if (callback && typeof (callback) === "function") {
                    callback();
                }
            },
            error: function (jqXHR, textStatus, errorThrown)
            {
                LDR.alert("Terdapat error saat mengambil data dari server");
                console.log("Terdapat error saat mengambil data dari server: " + errorThrown);
                setTimeout(function ()
                {
                    LDR.hidePreloader();
                }, 300);
            },
            complete: function (jqXHR, textStatus)
            {
                setTimeout(function ()
                {
                    LDR.hidePreloader();
                }, 300);
            }
        });
    },
    "get": function ($api, $data, callback)
    {

        $$.ajax({
            url: URL.api + $api,
            method: 'GET',
            dataType: 'json',
            data: $data,
            beforeSend: function (xhr)
            {
                WS.result = null;
                //LDR.showPreloader("Mohon Tunggu");
                LDR.showIndicator();
            },
            success: function (data, textStatus, jqXHR)
            {
                WS.result = data;
                WS.log = {"textStatus": textStatus, "jqXHR": jqXHR};
                //console.log("datanya ws: "+ JSON.stringify(data));
                if (callback && typeof (callback) === "function") {
                    callback();
                }
            },
            error: function (jqXHR, textStatus, errorThrown)
            {
                LDR.alert("Terdapat error saat mengambil data dari server");
                console.log("Terdapat error saat mengambil data dari server: " + errorThrown);
                setTimeout(function ()
                {
                    //LDR.hidePreloader();
                    LDR.hideIndicator();
                }, 300);
            },
            complete: function (jqXHR, textStatus)
            {
                setTimeout(function ()
                {
                    //LDR.hidePreloader();
                    LDR.hideIndicator();
                }, 300);
                console.log("WS get =>" + $api);
            }
        });
    }
};


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
        if (Keranjang.totalQty === 0) {
            var badge = $$('.keKeranjang').hide();
        } else {

            if ($$('.keKeranjang').css('display') === 'none') {
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
    if (operator === 'tambah') {
        this.subQty += 1;
        this.subTotal = this.hargaSatuan * this.subQty;
        this.setLabel();
        Keranjang.totalQty += 1;
        //console.log("tambah dari"+this.isi());
        return "ditambahkan";
    } else {
        this.subQty -= 1;
        if (this.subQty < 0) {
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

//====================================== 
//         Objek new order di pgOrder 
//======================================
//
//    produk = {
//        "id": '1',
//        "nama": 'laundry kiloan',
//        "harga": 7000,
//        "jumlah": 2,
//        "sub_total": this.harga * this.jumlah
//    };

window.$newOrder = {
    "dom_kiloan": false,
    "agen_laundry": {},
    "data": {
        "id_alamat": "",
        "id_laundry": null,
        "alamat": "",
        "no_tlp": "",
        "jenis_layanan": "1",
        "grand_total": 0,
        "produk": [],
        "catatan": ""
    },
    "act_save": function ()
    {
        $newOrder.data.id_alamat = $$('#f_alamatJemput').val().trim();
        $newOrder.data.alamat = $$('#txt_alamat').text().trim();
        $newOrder.data.no_tlp = $$('#txt_tlp').text().trim();
        $newOrder.data.catatan = $$('#f_catatanKhusus').val().trim();
        $newOrder.data.jenis_layanan = $$('#f_layanan').val().trim();
    },
    "act_nextTab": function (tabSkrg)
    {
        $newOrder.act_save();

        if (tabSkrg === "Informasi") {

            if ($newOrder.data.jenis_layanan === '1') {
                if ($$('#f_kg').val().trim() < 1 || $$('#f_kg').val().trim() === "") // validasi jumlah kg laundry kiloan
                {

                    LDR.alert("Silahkan isikan jumlah Kg");
                } else {
                    LDR.showTab("#tab_laundry");
                }
            } else {
                LDR.showTab("#tab_laundry");
            }

        } else if (tabSkrg === "Laundry") {
            LDR.showTab("#tab_konfirmasi");
        }
    },
    "show_kiloan": function ()
    {
        // perlu di cek udah dipilih atau belum laundrynya
        // untuk mengatur jenis list laundry
        var laundrySekitar = null;

        try {
            laundrySekitar = WS.result.result_data.laundry;
        } catch (err) {
            laundrySekitar = null;
        }

        var param = $user.data.location;
        param.token = $user.data.token;

        if (laundrySekitar === null) { // cek apakah data laundry sekitar sudah ada (menu agen laundry)
            console.log("call WS laundry kiloan di sekitar");
            WS.get("laundry/sekitar/", param, function ()
            {
                $newOrder.dom_listKiloan();
            });
        } else {
            // kalo udah ada list laundry sekitar langsung masukin dom
            $newOrder.dom_listKiloan();
        }
    },
    "dom_konfirmasi": function ()
    {
        var jenisLayanan = ["", "Laundry Kiloan", "Laundry satuan", "Dry cleaning"];

        $$('#txt_alamatJemput').html($newOrder.data.alamat);
        $$('#txt_jenisLayanan').html(jenisLayanan[$newOrder.data.jenis_layanan]);
        $$('#txt_catatan').html($newOrder.data.catatan);
        $$('#txt_catatan').html($newOrder.data.catatan);
        $$('#txt_agen').html($newOrder.agen_laundry.nama + "<p>" + $newOrder.agen_laundry.alamat + "</p>");
        $$('#txt_jarakLaundry').html(func_jarak($newOrder.agen_laundry.posisi) + " Km");
        var listLayanan = "";
        if ($newOrder.data.jenis_layanan === '1') { // kiloan

            try {
                var row = $newOrder.data.produk;
            } catch (err) {
                var row = null;
            }

            if (row !== null) {
                listLayanan += '<li class="item-content">' +
                        '<div class="item-media"><img src="img/layanan/' + row.foto + '" width="44"/></div>' +
                        '<div class="item-inner">' +
                        '<div class="item-title-row">' +
                        '<div class="item-title">' + row.nama + '</div>' +
                        '<div class="item-after">' +
                        '<span class="color-teal"><span class="itemSubTotal">' + func_numRp(row.sub_total) + '</span>&nbsp;/<span class="itemQty">' + row.jumlah + '</span> Kg </span>' +
                        '<a href="#" class="popOpsi"> &nbsp; &nbsp; &nbsp; <span class="fa fa-ellipsis-v fa-2x"></span></a></div>' +
                        '</div>' +
                        '<div class="item-subtitle">Harga ' + func_numRp(row.harga) + '</div>' +
                        '</div>' +
                        '</li>';
            } else {
                LDR.alert("Tidak ada produk yg dipilih");
            }

            // Untuk laundry kiloan, karena cuma 1 produk maka sub total = grand total
            $newOrder.data.grand_total = row.sub_total;

            $$('#ul_layanan').html(listLayanan);
            $$('#txt_grandTotal').html('<b class="color-teal">' + func_numRp($newOrder.data.grand_total) + '</b>');

        }
    },
    "dom_listKiloan": function ()
    {
        console.log("dom_listKiloan");
        if ($newOrder.data.id_laundry === null) { // belum milih laundry
            if ($newOrder.dom_kiloan === false) { // belum di masukin ke dom, untuk menghindari re-dom saat ganti tab
                console.log("muncul list laundry kiloan di sekitar");
                var listSekitar = "";

                window.list_laudryKiloan = WS.result.result_data.laundry.filter(function (el)
                {
                    // filter laundry hanya yg kiloan ajah
                    return (el.kiloan === true);
                });

                $$.each(list_laudryKiloan, function (index, value)
                {
                    var row = list_laudryKiloan[index];
                    var jarak = func_jarak(row.posisi);
                    listSekitar += '<li>'
                            + '<a href="#" data-id="' + row.id + '" data-harga="' + row.layanan_kiloan.harga + '" data-alamat="' + row.alamat + '" data-index="' + index + '" class="item-link item-content li_kiloan">'
                            + '<div class="item-media">'
                            + '<img class="img_layanan" src="' + URL.imgProfil + row.foto + '" alt="foto ' + row.nama + '"/>'
                            + '</div>'
                            + '<div class="item-inner">'
                            + '<div class="item-title-row">'
                            + '<div class="item-title txt_namaLaundry">' + row.nama + '</div>'
                            + '<div class="item-after">' + jarak + ' Km</div>'
                            + '</div>'
                            + '<div class="item-subtitle">' + rating[row.rating] + '</div>'
                            + '<div class="item-text">'
                            + 'Harga ' + func_numRp(row.layanan_kiloan.harga) + '/Kg'
                            + '</div>'
                            + '</div>'
                            + '</a>'
                            + '</li>';
                });
                $$('#ul_result').html(listSekitar);
                $newOrder.dom_kiloan = true;
            }
        } else {
            console.log("Ganti laundry neh coy");
            var row = $newOrder.agen_laundry;
            var jarak = func_jarak(row.posisi);
            listSekitar = '<li>'
                    + '<a href="#" data-id="' + row.id + '" data-harga="' + row.layanan_kiloan.harga + '" data-alamat="' + row.alamat + '" class="item-link item-content li_kiloan">'
                    + '<div class="item-media">'
                    + '<img class="img_layanan" src="' + URL.imgProfil + row.foto + '" alt="foto ' + row.nama + '"/>'
                    + '</div>'
                    + '<div class="item-inner">'
                    + '<div class="item-title-row">'
                    + '<div class="item-title txt_namaLaundry">' + row.nama + '</div>'
                    + '<div class="item-after">' + jarak + ' Km</div>'
                    + '</div>'
                    + '<div class="item-subtitle">' + rating[row.rating] + '</div>'
                    + '<div class="item-text">'
                    + 'Harga ' + func_numRp(row.layanan_kiloan.harga) + '/Kg'
                    + '</div>'
                    + '</div>'
                    + '</a>'
                    + '</li>';
            listSekitar += '<li><a href="#" id="btn_ubahAgen" class="button button-big button-fill button-raised color-pink">Ubah Laundry</a></li>'
            $$('#ul_result').html(listSekitar);

        }
    },
    "reset": function ()
    {
        $newOrder.dom_kiloan = false;
        $newOrder.agen_laundry = {};
        $newOrder.data = {
            "id_alamat": "",
            "id_laundry": null,
            "alamat": "",
            "no_tlp": "",
            "jenis_layanan": "1",
            "produk": [],
            "catatan": ""
        };
    }

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
    for (c in obj) {
        if (obj[c][prop] === val) {
            found = true;
            break;
        }
    }
    if (found) {
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
    if (Barang.subQty > 0) {
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

function func_jarak(lokasiLaundry)
{
    // untuk menghitung jarak KM dari lokasi A, ke B
    return Math.round(haversine($user.profil.posisi, lokasiLaundry));
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
    if (Keranjang.totalQty === 0) {

        //Jika keranjang kosong/baru masuk menu, ambil data dari db, tabel keranjang
        db.getItem('keranjang').then(function (value)
        {
            if (value !== null) {
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
    if (storedData) {
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
                    LDR.alert('Batal di hapus');
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

        if (tabSkrg === "Keranjang") {
            LDR.showTab("#tab_alamat");
        } else if (tabSkrg === "Alamat") {
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
//              pg-laundry.html
//======================================
LDR.onPageInit('pgLaundry', function (page)
{
    window.pgLaundry = 0;
    function data2sekitar(data)
    {
        //console.log(JSON.stringify(data));
        var listSekitar = "";
        $$.each(data, function (index, value)
        {
            var row = data[index];
            var jarak = func_jarak(row.posisi);
            //console.log(row.id);
            listSekitar += '<li>'
                    + '<a href="pg-laundry-profil.html?id=' + row.id + '" class="item-link item-content">'
                    + '<div class="item-media">'
                    + '<img src="' + URL.imgProfil + row.foto + '" alt="foto ' + row.nama + '"/>'
                    + '</div>'
                    + '<div class="item-inner">'
                    + '<div class="item-title-row">'
                    + '<div class="item-title">' + row.nama + '</div>'
                    + '<div class="item-after">' + jarak + ' Km</div>'
                    + '</div>'
                    + '<div class="item-subtitle">' + row.buka + '</div>'
                    + '<div class="item-text">'
                    + row.alamat
                    + '</div>'
                    + '</div>'
                    + '</a>'
                    + '</li>';
        });
        $$('#txt_listSekitar').html(listSekitar);
        window.pgLaundry = 1;
    }

    $$('#tab_sekitar').on('show', function ()
    {
        if (window.pgLaundry === 0) {
            var param = $user.data.location;
            param.token = $user.data.token;

            WS.get("laundry/sekitar/", param, function ()
            {
                data2sekitar(WS.result.result_data.laundry);
            });
        }
    });

});

LDR.onPageBeforeRemove('pgLaundry', function (page)
{
    window.pgLaundry = undefined;
    console.log("Menghapus window.pgLaundry");
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

    var halaman = $$.parseUrlQuery(LDR.views[0].url);
    console.log("ambil data halaman:" + halaman.id);

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
        url: URL.api + "profil/laundry/2/",
        method: 'GET',
        dataType: 'json',
        data: {},
        beforeSend: function (xhr)
        {
            LDR.showPreloader("Mohon Tunggu");
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
            setTimeout(function ()
            {
                LDR.hidePreloader();
            }, 300);
        },
        complete: function (jqXHR, textStatus)
        {
            setTimeout(function ()
            {
                LDR.hidePreloader();
            }, 300);
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
                        + '<div class="facebook-avatar"><img src="' + row.foto + '" class="avaBunder" width="34" height="34"></div>'
                        + '<div class="facebook-name">' + row.sender + '</div>'
                        + '<div class="facebook-date">' + func_timeRel(row.time) + '</div>'
                        + '</div>'
                        + '<div class="card-content">'
                        + '<div class="card-content-inner">'
                        + '<p>'
                        + rating[row.rating]
                        + '</p>'
                        + '<p class="color-gray">' + row.message + '</p>'
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


//======================================
//              pg-promo.html
//======================================
LDR.onPageBeforeInit('pgPromo', function (page)
{
    //LDR.router.load({context: window.ws_result.result_data.promo});
});

//======================================
//              pg-tracking.html
//======================================
LDR.onPageInit('pgTracking', function (page)
{
    $$('#form_track').on('submit', function (e)
    {
        e.preventDefault();

        var kode = $$('#f_KodeOrder').val().trim();

        if (kode === '') {
            LDR.alert("Isikan kode order kamu");
        } else {
            WS.get('tracking/', {"token": $user.data.token, "id": kode}, function ()
            {
                if (WS.result.result_code !== '00') {
                    LDR.alert(WS.result.result_msg);
                } else {
                    var listTracking = "";
                    var foto = ['tumpukan-pakaian.png', 'jepitan.png', 'mesin-cuci.png', 'mesin-cuci.png', 'setrika.png', 'pakaian-rapih.png'];
                    var status = ["Submit Order", "Pickup", "Menunggu antrian cuci", "Dicuci", "Disetrika", "Selesai diproses"];

                    $$.each(WS.result.result_data.tracking, function (index, value)
                    {
                        var row = WS.result.result_data.tracking[index];
                        listTracking += '<li>' +
                                '<a href="#" class="item-link item-content">' +
                                '<div class="item-media"><img src="img/' + foto[row.posisi] + '" width="80"></div>' +
                                '<div class="item-inner">' +
                                '<div class="item-title-row">' +
                                '<div class="item-title">' + status[row.posisi] + '</div>' +
                                '<div class="item-after">' + row.id + '</div>' +
                                '</div>' +
                                '<div class="item-subtitle txt_namaLaundry">' + row.nama_laundry + '</div>' +
                                '<div class="item-text">' + row.waktu + '</div>' +
                                '</div>' +
                                '</a>' +
                                '</li>';
                    });
                    $$('#div_track').html(listTracking);
                    $$('#div_track').show();
                }
            });
        }

    });
});


//======================================
//              pg-order.html
//======================================
LDR.onPageInit('pgOrder', function (page)
{
    // saat pgOrder di buka, isikan nilai default ke form


    $$('#f_layanan').on('change', function ()
    {
        if ($$(this).val() === '1') {
            $$('#li_kg').show();
        } else {
            $$('#li_kg').hide();
        }
    });


    // navigasi tab
    $$('.floating-button').on('click', function ()
    {
        var tabSkrg = $$('.tab-link.active').text();
        $newOrder.act_nextTab(tabSkrg);
    });

    $$('#tab_info').on('show', function ()
    {
        $newOrder.act_save();
    });

    $$('#tab_laundry').on('show', function ()
    {
        $newOrder.act_save();
        if ($newOrder.data.jenis_layanan === '1') // 1: Laundry kiloan
        {
            if ($$('#f_kg').val().trim() < 1 || $$('#f_kg').val().trim() === "") // validasi jumlah kg laundry kiloan
            {
                //LDR.showTab("#tab_info");
                LDR.alert("Silahkan isi jumlah Kg");
            } else {
                $newOrder.show_kiloan();
            }
        }
    });

    $$('#tab_konfirmasi').on('show', function ()
    {
        $newOrder.act_save();
        $$('#btn_selanjutnya').hide();

        if ($newOrder.data.id_laundry === null) {
            //LDR.showTab("#tab_laundry");
            LDR.alert("Silahkan pilih laundry dahulu");
        }

        $newOrder.dom_konfirmasi();
    });

    $$(document).on('click', '#btn_ubahAgen', function ()
    {
        $newOrder.data.id_laundry = null;
        $newOrder.agen_laundry = null;
        $newOrder.dom_kiloan = false;
        $newOrder.dom_listKiloan();

    });

    $$(document).on('click', '.li_kiloan', function ()
    {
        // list laundry di klik
        var nama = $$(this).find('.txt_namaLaundry').text();
        var dataset = $$.dataset($$(this));

        //console.log(dataset);
        $$('a.disabled').removeClass('disabled');

        if ($newOrder.data.id_laundry === null) { // laundry belum di pilih
            $newOrder.agen_laundry = list_laudryKiloan[dataset.index];
            $newOrder.data.id_laundry = dataset.id;
        }
        ;
//        $newOrder.agen_laundry.nama = $$(this).find('.txt_namaLaundry').text();
//        $newOrder.agen_laundry.alamat = dataset.alamat;
        $newOrder.data.produk = {
            "id": '1',
            "nama": 'Laundry Kiloan',
            "foto": "kiloan.jpg",
            "harga": dataset.harga,
            "jumlah": $$('#f_kg').val().trim(),
            "sub_total": dataset.harga * $$('#f_kg').val().trim()
        };

        //LDR.alert("Laundry dipilih " + nama);
        LDR.showTab("#tab_konfirmasi");
    });

    $$(document).on('click', '.popOpsi', function ()
            //$$('.popOpsi').on('click', function ()
            {
                //overite variabel global itemId
                itemId = $$(this).parents('.item-content').find('.item-title').text();
                itemIni = $$(this).parents('.item-content');

                //console.log(itemId);
                var clickedLink = this;
                LDR.popover('.popoverOpsi', clickedLink);
            });


    // membuat picker Jumlah
    var pickerDevice = LDR.picker({
        cols: [
            {
                textAlign: 'center',
                values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
            }
        ],
        onClose: function (p)
        {
            var nilai = p.value;
            // setelah di dapat nilai baru

            //console.log(nilai);
            // masukan nilai baru ke element jumlah/update database
            itemIni.find('.itemQty').text(nilai);
            $newOrder.data.produk.jumlah = nilai;
            $newOrder.data.produk.sub_total = nilai * $newOrder.data.produk.harga;
            $newOrder.dom_konfirmasi();
        }
    });


    // class ItemHapus adanya di index.html
    //$$(document).on('click', '.itemHapus', function ()
    $$('.itemHapus').on('click', function ()
    {

        LDR.closeModal(); // menutup popoverOpsi
        LDR.confirm('Apakah kamu yakin?', 'Hapus Item',
                function ()
                {
                    itemIni.hide(); //proses hapus
                    //LDR.alert(itemId + ' Dihapus');
                    $newOrder.data.produk = null;
                    $newOrder.dom_konfirmasi();
                },
                function ()
                {
                    //LDR.alert('You clicked Cancel button');
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

    $$('#btn_submitOrder').on('click', function ()
    {
        LDR.alert("Proses submit order \n" + JSON.stringify($newOrder.data));
        console.log(JSON.stringify($newOrder.data));
    });

    $$('#btn_hapusOrder').on('click', function ()
    {
        LDR.confirm('Apakah kamu yakin?', 'Hapus Order',
                function ()
                {
                    LDR.alert('Order Dihapus');
                    //$newOrder = null;
                    $newOrder.reset();
                    list_laudryKiloan = null;
                    mainView.router.loadPage('index.html');

                },
                function ()
                {
                    //LDR.alert('Batal di hapus');
                }
        );
    });
});
