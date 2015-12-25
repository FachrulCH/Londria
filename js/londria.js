//======================================
//         Deklarasi Objek
//======================================
var PARA = {"produk": null, "laundrySekitar": []};
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
        if (PARA.produk === undefined || PARA.produk === null) {
            $$.getJSON('data/produk.json', {}, function (data)
            {
                PARA.produk = data;
                console.log("ambil PARA layanan");
            });
        }

        // issue ketika popup trus klik button back, si modal ga ketutup
        document.addEventListener("backbutton", function (e)
        {
            if ($$('.modal-in').length > 0) {
                e.preventDefault();
                LDR.closeModal();
            } else {
                navigator.app.backHistory();
            }
        }, false);
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
                "nama": "Alamat satu",
                "alamat": "jl alamat satu no 1",
                "koordinat": {
                    "latitude": -6.2036776,
                    "longitude": 106.8214523
                }
            }, {
                "id": '2',
                "nama": "Alamat Dua",
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
    get_fav: function ()
    {
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
            ];
            console.log("Looping fav");
            for (var i = 0; i < 5000; i++) {
                $user.favorit.push({
                    "id": "9" + i,
                    "nama": "Laundry virtual " + i,
                    "posisi": {
                        "latitude": -6.2038774,
                        "longitude": 106.8214524
                    },
                    "alamat": "Jl. laundry virtual list " + i,
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
                });
            }
        }
        ;
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
    "dom_dryCleaning": false,
    "agen_laundry": null,
    "last_qty": 0,
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
    "add": function (newItem)
    {
        $newOrder.last_qty = 0;
        // item default
        var item = {
            id: newItem.id,
            qty: 1,
            price: newItem.price,
            total: newItem.price
        };
        var ada = false; // checkpoint

        if ($newOrder.data.produk.length > 0) {
            // pengecekan apakah item tersebut sudah ada di cart

            $$.each($newOrder.data.produk, function (index, value)
            {
                if ($newOrder.data.produk[index].id === item.id) {
                    ada = true;
                    $newOrder.data.produk[index].qty = $newOrder.data.produk[index].qty + 1;
                    $newOrder.last_qty = $newOrder.data.produk[index].qty;
                    $newOrder.data.produk[index].total = $newOrder.data.produk[index].qty * $newOrder.data.produk[index].price;
                    $newOrder.data.grand_total = $newOrder.data.grand_total + $newOrder.data.produk[index].price;
                }
            });
        }

        if (ada === false || $newOrder.data.produk.length === 0) {
            //tambah item baru
            $newOrder.data.produk.push(item);
            $newOrder.last_qty = 1;
            $newOrder.data.grand_total = $newOrder.data.grand_total + item.total;
        }

    },
    "min": function (newItem)
    {

        var toDel = false; // checkpoint
        var idDel = null;
        if ($newOrder.data.produk.length > 0) {

            $newOrder.last_qty = 0;
            // pengecekan apakah item tersebut sudah ada di cart
            $$.each($newOrder.data.produk, function (index, value)
            {
                if ($newOrder.data.produk[index].id === newItem.id) {
                    $newOrder.data.produk[index].qty = $newOrder.data.produk[index].qty - 1;
                    $newOrder.last_qty = $newOrder.data.produk[index].qty;
                    $newOrder.data.produk[index].total = $newOrder.data.produk[index].qty * $newOrder.data.produk[index].price;
                    $newOrder.data.grand_total = $newOrder.data.grand_total - $newOrder.data.produk[index].price;
                }

                if ($newOrder.data.produk[index].qty === 0) {
                    toDel = true;
                    idDel = $newOrder.data.produk[index].id;
                }
            });
            if (toDel) {
                $newOrder.del(idDel);
            }

        } else {
            LDR.alert("Tidak ada layanan yang dipilih");
        }

    },
    "del": function (id)
    {

        if ($newOrder.data.id_laundry !== null) {
            //kalo udah pernah milih laundry, update juga dom nya jadi 0
            var ada = false;

            $$.each($newOrder.data.produk, function (index, value)
            {
                if ($newOrder.data.produk[index].id === id) {
                    ada = true;
                    $newOrder.data.grand_total = $newOrder.data.grand_total - $newOrder.data.produk[index].total;
                }
            });

            if (ada) {
                hapusArray($newOrder.data.produk, 'id', id);
            }

            document.querySelectorAll("[data-id='" + id + "'] .li_qty")[0].textContent = "0";
            $$('#txt_totalLayanan').text(func_numRp($newOrder.data.grand_total));
        }
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

        var param = $user.data.location;
        param.token = $user.data.token;
        if (PARA.laundrySekitar.length === 0) { // cek apakah data laundry sekitar sudah ada (menu agen laundry)
            console.log("call WS laundry kiloan di sekitar");
            WS.get("laundry/sekitar/", param, function ()
            {
                PARA.laundrySekitar = WS.result.result_data.laundry;
                WS.result.result_data = null; //free memory
                $newOrder.dom_listKiloan();
            });
        } else {
            // kalo udah ada list laundry sekitar langsung masukin dom
            $newOrder.dom_listKiloan();
        }
    },
    "show_dryCleaning": function ()
    {
        // perlu di cek udah dipilih atau belum laundrynya
        var param = $user.data.location;
        param.token = $user.data.token;
        if (PARA.laundrySekitar.length === 0) { // cek apakah data laundry sekitar sudah ada (menu agen laundry)
            console.log("call WS laundry kiloan di sekitar");
            WS.get("laundry/sekitar/", param, function ()
            {
                PARA.laundrySekitar = WS.result.result_data.laundry;
                WS.result.result_data = null; //free memory
                $newOrder.dom_listDryCleaning();
            });
        } else {
            // kalo udah ada list laundry sekitar langsung masukin dom
            $newOrder.dom_listDryCleaning();
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
            $newOrder.data.grand_total = row.total;
            $$('#ul_layanan').html(listLayanan);
            $$('#txt_grandTotal').html('<b class="color-teal">' + func_numRp($newOrder.data.grand_total) + '</b>');
        } else { // dry cleaning && laundry satuan
            $$('#txt_jenisCucian').text("Jenis Cucian");
            try {
                var cucian = $newOrder.data.produk;
            } catch (err) {
                var cucian = null;
            }

            if (cucian !== null) {
                $$('#ul_layanan').html(""); //dikosongin dlu
                $$.each(cucian, function (index, value)
                {
                    var row = cucian[index];
                    var produk = PARA.produk[row.id];
                    $$('#ul_layanan').prepend('<li class="item-content" data-id="' + row.id + '" data-index="' + index + '">' +
                            '<div class="item-media"><img src="img/layanan/' + produk.foto + '" width="44"/></div>' +
                            '<div class="item-inner">' +
                            '<div class="item-title-row">' +
                            '<div class="item-title">' + produk.nama + '</div>' +
                            '<div class="item-after">' +
                            '<span class="color-teal"><span class="itemSubTotal">' + func_numRp(row.total) + '</span> (<span class="itemQty">' + row.qty + '</span>) </span>' +
                            '<a href="#" class="popOpsi"> &nbsp; &nbsp; &nbsp; <span class="fa fa-ellipsis-v fa-2x"></span></a></div>' +
                            '</div>' +
                            '<div class="item-subtitle">Harga satuan ' + func_numRp(row.price) + '</div>' +
                            '</div>' +
                            '</li>');
                });

                $$('#ul_layanan').append('<li class="item-content">' +
                        '<div class="item-media"><span class="fa fa-plus fa-2x"></span></div>' +
                        '<div class="item-inner">' +
                        '<a href="#" id="btn_tambahProd">Tambah Layanan</a>' +
                        '</div>' +
                        '</li>');
            } else {
                LDR.alert("Tidak ada produk yg dipilih");
            }
        }
    },
    "dom_listDryCleaning": function ()
    {
        console.log("dom_listDryCleaning");

        if (window.list_laudryDC === undefined || window.list_laudryDC.length === 0) {
            window.list_laudryDC = PARA.laundrySekitar.filter(function (el)
            {
                // filter laundry hanya yg kiloan ajah
                return (el.dry_cleaning === true);
            });
        }

        if ($newOrder.data.id_laundry === null) { // belum milih laundry
            if ($newOrder.dom_dryCleaning === false) { // belum di masukin ke dom, untuk menghindari re-dom saat ganti tab
                console.log("muncul list laundry drycleaning di sekitar");
                var listSekitar = "";
                // testing banyaknya laundry sekitar
//                for (var i = 0; i < 1000; i++) {
//                    PARA.laundrySekitar.push({"id": 123, "nama": "Laundry virtual " + i, "posisi": {"latitude": -6.1253871, "longitude": 106.2249587}, "alamat": "Rumahnya ini disini", "buka": "Setiap hari, 09:00-22:00", "foto": "avatar.png", "desc": "Ini adalah deskripsi", "rating": 4, "kiloan": true, "layanan_kiloan": {"id": "001", "nama": "Laundry kiloan virtual " + 1, "harga": 7000, "foto": "kiloan.jpg"}});
//                }
                // Create virtual list
                var virtualList = LDR.virtualList('.virtual-list', {
                    items: window.list_laudryDC, // data buat virtualist
                    renderItem: function (index, item)
                    {
                        return '<li>'
                                + '<a href="#" data-id="' + item.id + '" data-alamat="' + item.alamat + '" data-index="' + index + '" class="item-link item-content li_laundryProduk">'
                                + '<div class="item-media">'
                                + '<img class="img_layanan" src="' + URL.imgProfil + item.foto + '" alt="foto ' + item.nama + '"/>'
                                + '</div>'
                                + '<div class="item-inner">'
                                + '<div class="item-title-row">'
                                + '<div class="item-title txt_namaLaundry">' + item.nama + '</div>'
                                + '<div class="item-after">' + func_jarak(item.posisi) + ' Km</div>'
                                + '</div>'
                                + '<div class="item-subtitle">' + rating[item.rating] + '</div>'
                                + '<div class="item-text">'
                                + 'ada ' + item.layanan.length + ' layanan laundry'
                                + '</div>'
                                + '</div>'
                                + '</a>'
                                + '</li>';
                    }
                });
                $newOrder.dom_dryCleaning = true;
            }
        } else {
            console.log("Ganti laundry neh coy");
            var row = $newOrder.agen_laundry;

            if (row.dry_cleaning === undefined || row.dry_cleaning === false) {
                LDR.alert("Agen laundry " + $newOrder.agen_laundry.nama + " tidak memiliki layanan Dry Cleaning, silahkan ganti pilihan agen laundry");
                $newOrder.reset();
                setTimeout(function ()
                {
                    $newOrder.show_dryCleaning();
                }, 10);

            } else {
                var jarak = func_jarak(row.posisi);
                listSekitar = '<li>'
                        + '<a href="#" data-id="' + row.id + '" data-alamat="' + row.alamat + '" class="item-link item-content li_laundryProduk">'
                        + '<div class="item-media">'
                        + '<img class="img_layanan" src="' + URL.imgProfil + row.foto + '" alt="foto ' + row.nama + '"/>'
                        + '</div>'
                        + '<div class="item-inner">'
                        + '<div class="item-title-row">'
                        + '<div class="item-title txt_namaLaundry">' + row.nama + '</div>'
                        + '<div class="item-after">' + func_jarak(row.posisi) + ' Km</div>'
                        + '</div>'
                        + '<div class="item-subtitle">' + rating[row.rating] + '</div>'
                        + '<div class="item-text">'
                        + 'ada ' + row.layanan.length + ' layanan laundry'
                        + '</div>'
                        + '</div>'
                        + '</a>'
                        + '</li>';
                listSekitar += '<li><a href="#" id="btn_ubahAgen" class="button button-big button-fill button-raised color-pink">Ubah Laundry</a></li>'
                $$('#ul_result').html(listSekitar);
            }
        }
    },
    "dom_listKiloan": function ()
    {
        console.log("dom_listKiloan");
        if ($newOrder.data.id_laundry === null) { // belum milih laundry
            if ($newOrder.dom_kiloan === false) { // belum di masukin ke dom, untuk menghindari re-dom saat ganti tab
                console.log("muncul list laundry kiloan di sekitar");
                var listSekitar = "";
                // testing banyaknya laundry sekitar
                for (var i = 0; i < 1000; i++) {
                    PARA.laundrySekitar.push({"id": 123, "nama": "Laundry virtual " + i, "posisi": {"latitude": -6.1253871, "longitude": 106.2249587}, "alamat": "Rumahnya ini disini", "buka": "Setiap hari, 09:00-22:00", "foto": "avatar.png", "desc": "Ini adalah deskripsi", "rating": 4, "kiloan": true, "layanan_kiloan": {"id": "001", "nama": "Laundry kiloan virtual " + 1, "harga": 7000, "foto": "kiloan.jpg"}});
                }


                window.list_laudryKiloan = PARA.laundrySekitar.filter(function (el)
                {
                    // filter laundry hanya yg kiloan ajah
                    return (el.kiloan === true);
                });
                // Create virtual list
                var virtualList = LDR.virtualList('.virtual-list', {
                    items: window.list_laudryKiloan, // data buat virtualist
                    renderItem: function (index, item)
                    {
                        return '<li>'
                                + '<a href="#" data-id="' + item.id + '" data-harga="' + item.layanan_kiloan.harga + '" data-alamat="' + item.alamat + '" data-index="' + index + '" class="item-link item-content li_laundry">'
                                + '<div class="item-media">'
                                + '<img class="img_layanan" src="' + URL.imgProfil + item.foto + '" alt="foto ' + item.nama + '"/>'
                                + '</div>'
                                + '<div class="item-inner">'
                                + '<div class="item-title-row">'
                                + '<div class="item-title txt_namaLaundry">' + item.nama + '</div>'
                                + '<div class="item-after">' + func_jarak(item.posisi) + ' Km</div>'
                                + '</div>'
                                + '<div class="item-subtitle">' + rating[item.rating] + '</div>'
                                + '<div class="item-text">'
                                + 'Harga ' + func_numRp(item.layanan_kiloan.harga) + '/Kg'
                                + '</div>'
                                + '</div>'
                                + '</a>'
                                + '</li>';
                    }
                });
                $newOrder.dom_kiloan = true;
            }
        } else {
            console.log("Ganti laundry neh coy");
            var row = $newOrder.agen_laundry;
            var jarak = func_jarak(row.posisi);
            listSekitar = '<li>'
                    + '<a href="#" data-id="' + row.id + '" data-harga="' + row.layanan_kiloan.harga + '" data-alamat="' + row.alamat + '" class="item-link item-content li_laundry">'
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
    "validate": function ()
    {
        var hasil = true;
        if ($newOrder.data.id_alamat === "x" || $newOrder.data.id_alamat === "0") {
            LDR.alert("Silahkan pilih alamat penjemputan");
            LDR.showTab("#tab_info");
            hasil = false;
        }

        if ($newOrder.data.jenis_layanan === '1') { // kiloan
            if ($$('#f_kg').val().trim() < 1 || $$('#f_kg').val().trim() === "") // validasi jumlah kg laundry kiloan
            {

                LDR.alert("Silahkan isikan jumlah Kg");
                LDR.showTab("#tab_info");
                hasil = false;
            }

        }

        if ($newOrder.data.id_laundry === null) {
            //LDR.showTab("#tab_laundry");
            LDR.alert("Silahkan pilih laundry dahulu");
            hasil = false;
        }

        if ($newOrder.data.grand_total <= 0) {
            LDR.alert("Total order tidak boleh 0");
            hasil = false;
        }
        return hasil;
    },
    "reset": function ()
    {
        console.log("reset newOrder");
        $newOrder.dom_kiloan = false;
        $newOrder.dom_dryCleaning = false;
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

        $$('#ul_layanan').html("");
        $$('#txt_alamatJemput').html("");
        $$('#txt_jenisLayanan').html("");
        $$('#txt_catatan').html("");
        $$('#txt_catatan').html("");
        $$('#txt_agen').html("");
        $$('#txt_jarakLaundry').html("");
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
//    $$('.itemUbahJum').on('click', function ()
//    {
//        LDR.closeModal(); // menutup popoverOpsi
//
//        // dibuat timeout agar syncronus setelah elemen muncul
//        setTimeout(function ()
//        {
//            pickerDevice.open();
//        }, 10);
//
//
//    });

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
//    var pickerDevice = LDR.picker({
//        cols: [
//            {
//                textAlign: 'center',
//                values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
//            }
//        ],
//        onClose: function (p)
//        {
//            var nilai = p.value;
//            // setelah di dapat nilai baru
//
//            //console.log(nilai);
//            // masukan nilai baru ke element jumlah/update database
//            itemIni.find('.itemQty').text(nilai);
//
//        }
//    });
});
//======================================
//              pg-virtualist.html
//======================================
LDR.onPageInit('pgVirtualist', function (page)
{
    console.log("contoh penggunaaan virtualis dimulai");
    // Create virtual list
    var virtualList = LDR.virtualList('.virtual-list', {
        items: $user.favorit,
        // List item Template7 template
        template: '<li>'
                + '<a href="pg-laundry-profil.html?id={{id}}" class="item-link item-content">'
                + '<div class="item-media">'
                + '<img src="{{foto}}" alt="foto {{nama}}"/>'
                + '</div>'
                + '<div class="item-inner">'
                + '<div class="item-title-row">'
                + '<div class="item-title">{{nama}}</div>'
                + '<div class="item-after">0 Km</div>'
                + '</div>'
                + '<div class="item-subtitle">{{buka}}</div>'
                + '<div class="item-text">{{alamat}}</div>'
                + '</div>'
                + '</a>'
                + '</li>'
    });
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
                PARA.laundrySekitar = WS.result.result_data.laundry;
                data2sekitar(PARA.laundrySekitar);
                WS.result.result_data = null; //free memory
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
    //----- masukan opsi alamat
    $$.each($user.profil.lokasi, function (index, value)
    {
        var row = $user.profil.lokasi[index];
        $$('#f_alamatJemput').append('<option value="' + row.id + '" data-alamat="' + row.alamat + '">' + row.nama + '</option>');
    });
    $$('#f_alamatJemput').append('<option value="0">(+) Tambah alamat</option>');
    $$('#f_alamatJemput').on('change', function ()
    {
        if ($$(this).val() === "0") { //Tambah alamat
            mainView.router.loadPage('pg-profil-alamat.html');
        } else {
            var id_alamat = $$(this).val();
            //console.log("update alamat =>"+id_alamat);

            // ganti text alamat sesuai opsi alamat yg dipilih
            var opsiDipilih = $user.profil.lokasi.filter(function (el)
            {
                return (el.id === id_alamat);
            });
            //console.log(opsiDipilih);
            $$('#li_alamat').show();
            $$('#txt_alamat').text(opsiDipilih[0].alamat);
        }
        //----- end opsi alamat

    });
    $$('#f_layanan').on('change', function ()
    {
        // reset lagi
        $newOrder.dom_dryCleaning = false;
        $newOrder.dom_kiloan = false;

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
        } else if ($newOrder.data.jenis_layanan === '2') {

        } else if ($newOrder.data.jenis_layanan === '3') {
            $newOrder.show_dryCleaning();
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
    $$(document).on('click', '#btn_tambahProd', function ()
    {
        LDR.popup('.popup_layanan');
    });
    $$(document).on('click', '.li_laundryProduk', function ()
    {
        var nama = $$(this).find('.txt_namaLaundry').text();
        var dataset = $$.dataset($$(this));
        $newOrder.data.id_laundry = dataset.id;
        // Dry clean
        if ($newOrder.agen_laundry === null || $newOrder.agen_laundry.id !== $newOrder.data.id_laundry || $newOrder.dom_dryCleaning === false) {
            
            $newOrder.agen_laundry = $newOrder.agen_laundry || list_laudryDC[dataset.index];
            
            console.log("Looping data layanan");
            $$.each($newOrder.agen_laundry.layanan, function (index, value)
            {
                var row = $newOrder.agen_laundry.layanan[index];
                var produk = PARA.produk[row.id];
                $$('#ul_layAgen').prepend('<li class="li_layananLDR" data-id="' + row.id + '" data-price="' + row.harga_dc + '">' +
                        '<div class="item-content">' +
                        '<div class="item-media avaBunder">' +
                        '<img src="img/layanan/' + produk.foto + '" alt="foto"/>' +
                        '</div>' +
                        '<div class="item-inner">' +
                        '<div class="item-title-row">' +
                        '<div class="item-title">' + produk.nama + '</div>' +
                        '<div class="item-after">' +
                        '<div class="row no-gutter">' +
                        '<div class="col-33"><a href="#" class="btn_cartMin"><i class="fa fa-minus-circle fa-2x"></i>&nbsp;&nbsp;</a></div>' +
                        '<div class="col-33"><b style="font-size: 1.8em" class="li_qty">0</b></div>' +
                        '<div class="col-33"><a href="#" class="btn_cartAdd">&nbsp;&nbsp;<i class="fa fa-plus-circle fa-2x"></i></a></div>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '<div class="item-subtitle"></div>' +
                        '<div class="item-text">' +
                        func_numRp(row.harga_dc) + '/Pc' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '</li>');
            });
        }

        $$('#txt_namaLaundry').text($newOrder.agen_laundry.nama);
        LDR.popup('.popup_layanan');
    });
    $$(document).on('click', '.li_laundry', function ()
    {
        // list laundry di klik
        var nama = $$(this).find('.txt_namaLaundry').text();
        var dataset = $$.dataset($$(this));
        //console.log(dataset);
        $$('a.disabled').removeClass('disabled');
        if ($newOrder.data.id_laundry === null) { // laundry belum di pilih

            if ($newOrder.data.jenis_layanan === "1") { // kiloan

                $newOrder.agen_laundry = list_laudryKiloan[dataset.index];
                $newOrder.data.produk = {
                    "id": '1',
                    "nama": 'Laundry Kiloan',
                    "foto": "kiloan.jpg",
                    "harga": dataset.harga,
                    "jumlah": $$('#f_kg').val().trim(),
                    "sub_total": dataset.harga * $$('#f_kg').val().trim()
                };
            }
            $newOrder.data.id_laundry = dataset.id;
        }



        //LDR.alert("Laundry dipilih " + nama);
        LDR.showTab("#tab_konfirmasi");
    });
    $$(document).on('click', '.btn_cartAdd', function ()
    {
        // ada di popup layanan laundry dry cleaning, sam asatuan ketika button (+) list layanan di klik
        console.log("tambah cart");
        var newItem = $$.dataset($$(this).parents('.li_layananLDR'));
        $newOrder.add(newItem);
        $$(this).parents('.li_layananLDR').find('.li_qty').text($newOrder.last_qty);
        $$('#txt_totalLayanan').text(func_numRp($newOrder.data.grand_total));
    });
    $$(document).on('click', '.btn_cartMin', function ()
    {
        // ada di popup layanan laundry dry cleaning, sam asatuan ketika button (-) list layanan di klik
        console.log("kurangi cart");
        var newItem = $$.dataset($$(this).parents('.li_layananLDR'));
        $newOrder.min(newItem);
        $$(this).parents('.li_layananLDR').find('.li_qty').text($newOrder.last_qty);
        $$('#txt_totalLayanan').text(func_numRp($newOrder.data.grand_total));
    });
    $$(document).on('click', '.popOpsi', function ()
            //$$('.popOpsi').on('click', function ()
            {
                //overite variabel global itemId
                itemPilih = $$.dataset($$(this).parents('.item-content'));
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
            var txt_qty = itemIni.find('.itemQty');
            console.log("ganti QTY A" + itemIni);
            console.log("nilai semula =" + txt_qty.text());
            // masukan nilai baru ke element jumlah/update database
            console.log("nilai harusnya =" + nilai);
            txt_qty.text(nilai);
            console.log("nilai setelah =" + txt_qty.text());
            var id = itemPilih.index;
            //update cart produk
            $newOrder.data.produk[id].qty = nilai;
            $newOrder.data.produk[id].total = nilai * $newOrder.data.produk[id].price;
            setTimeout(function ()
            {
                // biar update dlu baru refresh
                $newOrder.dom_konfirmasi();
            }, 100);
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

                    //LDR.alert(itemId + ' Dihapus');
                    $newOrder.del(itemPilih.id);

                    itemIni.hide(); //proses hapus
                    setTimeout(function ()
                    {
                        // biar update dlu baru refresh
                        $newOrder.dom_konfirmasi();
                    }, 100);
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
        if ($newOrder.validate()) {
            LDR.alert("Proses submit order \n" + JSON.stringify($newOrder.data));
            console.log(JSON.stringify($newOrder.data));
        }

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
    // ketika back button, harus nutup popup
    $$(window).on('popstate', function ()
    {
        LDR.closeModal('.popup.modal-in');
    });
    $$('.popup_layanan').on('closed', function ()
    {
        if ($newOrder.data.produk.length === 0)
            LDR.alert("Tidak ada layanan yang dipilih");
        $newOrder.dom_listDryCleaning();
        setTimeout(function ()
        {
            // biar update dlu baru refresh
            $newOrder.dom_konfirmasi();
        }, 100);
    });
});
