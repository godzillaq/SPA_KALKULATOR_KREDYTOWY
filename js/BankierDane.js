var LTV90_NK_Banki_JSON;
var LTV90_SK_Banki_JSON;
var LTV80_NK_Banki_JSON;
var LTV80_SK_Banki_JSON;

var adres = 'http://www.bankier.pl/wiadomosc/Najlepsze-kredyty-hipoteczne-kwiecien-2017-Ranking-Bankier-pl-7512819.html';


jQuery.ajax = (function(_ajax){

    var protocol = location.protocol,
        hostname = location.hostname,
        exRegex = RegExp(protocol + '//' + hostname),
        YQL = 'http' + (/^https/.test(protocol)?'s':'') + '://query.yahooapis.com/v1/public/yql?callback=?',
        query = 'select * from html where url="{URL}" and xpath="*"';

    function isExternal(url) {
        return !exRegex.test(url) && /:\/\//.test(url);
    }

    return function(o) {

        var url = o.url;

        if ( /get/i.test(o.type) && !/json/i.test(o.dataType) && isExternal(url) ) {

            o.url = YQL;
            o.dataType = 'json';

            o.data = {
                q: query.replace(
                    '{URL}',
                    url + (o.data ?
                        (/\?/.test(url) ? '&' : '?') + jQuery.param(o.data)
                    : '')
                ),
                format: 'xml'
            };

            if (!o.success && o.complete) {
                o.success = o.complete;
                delete o.complete;
            }

            o.success = (function(_success){
                return function(data) {

                    if (_success) {
                        
                        _success.call(this, {
                            responseText: data.results[0]
                                .replace(/<script[^>]+?\/>|<script(.|\s)*?\/script>/gi, '')
                        }, 'success');
                    }

                };
            })(o.success);

        }

        return _ajax.apply(this, arguments);

    };

})(jQuery.ajax);



$.ajax({
    url: adres,
    type: 'GET',
    success: function(res) {
        var text = res.responseText;
        // then you can manipulate your text as you wish
        //alert(text);
		
		
		//----------- Pobieram dane dla LTV 90 proc NOWY KLIENT -----------
		var LTV90_NK_Banki =[];
		var foo = $(text).find('table:eq(0)').html(); 
		var i;
		for (i = 2; i < 10; i++) 
		{ 
			var txt;
			var dane;
			var obj = new Object();
			txt = $(foo).find('tr:eq(' + i + ')').html();
			obj.Bank = $.trim($(txt).eq(1).text().replace('%', '').replace(/[^0-9a-z ]/gi, ''));
			obj.Oprocentowanie = $.trim($(txt).eq(2).text().replace(/[^0-9a-z,]/gi, ''));
			obj.Marza = $.trim($(txt).eq(3).text().replace(/[^0-9a-z,]/gi, ''));
			LTV90_NK_Banki.push(obj);		
		}
		LTV90_NK_Banki_JSON = JSON.stringify(LTV90_NK_Banki);

		//----------- Pobieram dane dla LTV 90 proc STAŁY KLIENT -----------
		var LTV90_SK_Banki =[];
		foo = $(text).find('table:eq(1)').html(); 
		for (i = 2; i < 11; i++) 
		{ 
			var txt;
			var dane;
			var obj = new Object();
			txt = $(foo).find('tr:eq(' + i + ')').html(); 
			obj.Bank = $.trim($(txt).eq(1).text().replace('%', '').replace(/[^0-9a-z ]/gi, ''));
			obj.Oprocentowanie = $.trim($(txt).eq(2).text().replace(/[^0-9a-z,]/gi, ''));
			obj.Marza = $.trim($(txt).eq(3).text().replace(/[^0-9a-z,]/gi, ''));
			LTV90_SK_Banki.push(obj);		
		}
		LTV90_SK_Banki_JSON = JSON.stringify(LTV90_SK_Banki);
		
		//----------- Pobieram dane dla LTV 80 proc NOWY KLIENT -----------
		var LTV80_NK_Banki =[];
		var foo = $(text).find('table:eq(2)').html(); 
		var i;
		for (i = 2; i < 14; i++) 
		{ 
			var txt;
			var dane;
			var obj = new Object();
			txt = $(foo).find('tr:eq(' + i + ')').html();
			obj.Bank = $.trim($(txt).eq(1).text().replace('%', '').replace(/[^0-9a-z ]/gi, ''));
			obj.Oprocentowanie = $.trim($(txt).eq(2).text().replace(/[^0-9a-z,]/gi, ''));
			obj.Marza = $.trim($(txt).eq(3).text().replace(/[^0-9a-z,]/gi, ''));
			LTV80_NK_Banki.push(obj);		
		}
		LTV80_NK_Banki_JSON = JSON.stringify(LTV80_NK_Banki);
		
		//----------- Pobieram dane dla LTV 80 proc STAŁY KLIENT -----------
		var LTV80_SK_Banki =[];
		var foo = $(text).find('table:eq(3)').html(); 
		var i;
		for (i = 2; i < 15; i++) 
		{ 
			var txt;
			var dane;
			var obj = new Object();
			txt = $(foo).find('tr:eq(' + i + ')').html();
			obj.Bank = $.trim($(txt).eq(1).text().replace('%', '').replace(/[^0-9a-z ]/gi, ''));
			obj.Oprocentowanie = $.trim($(txt).eq(2).text().replace(/[^0-9a-z,]/gi, ''));
			obj.Marza = $.trim($(txt).eq(3).text().replace(/[^0-9a-z,]/gi, ''));
			LTV80_SK_Banki.push(obj);		
		}
		LTV80_SK_Banki_JSON = JSON.stringify(LTV80_SK_Banki);	
		
		UstawTabele();
    }
});

function Get_LTV90_NK_Banki_JSON() { return LTV90_NK_Banki_JSON; }
function Get_LTV90_SK_Banki_JSON() { return LTV90_SK_Banki_JSON; }
function Get_LTV80_NK_Banki_JSON() { return LTV80_NK_Banki_JSON; }
function Get_LTV80_SK_Banki_JSON() { return LTV80_SK_Banki_JSON; }

function UstawTabele()
{
	var banki = [];
	banki = JSON.parse(LTV90_NK_Banki_JSON);

	for (var index = 0; index < banki.length; index++)
	{		
		var wiersz;
		wiersz = '<tr>';
		wiersz += '<td>' + (index + 1) + '</td>';
		wiersz += '<td>' + banki[index].Bank + '</td>';
		wiersz += '<td>' + banki[index].Oprocentowanie + '</td>';
		wiersz += '<td>' + banki[index].Marza + '</td>';
		wiersz += '</tr>';
		$('#Table90NK tr:last').after(wiersz);
	}
	
	banki = [];
	banki = JSON.parse(LTV90_SK_Banki_JSON); 

	for (var index = 0; index < banki.length; index++)
	{		
		var wiersz;
		wiersz = '<tr>';
		wiersz += '<td>' + (index + 1) + '</td>';
		wiersz += '<td>' + banki[index].Bank + '</td>';
		wiersz += '<td>' + banki[index].Oprocentowanie + '</td>';
		wiersz += '<td>' + banki[index].Marza + '</td>';
		wiersz += '</tr>';
		$('#Table90SK tr:last').after(wiersz);
	}
	
	banki = [];
	banki = JSON.parse(LTV80_NK_Banki_JSON);

	for (var index = 0; index < banki.length; index++)
	{		
		var wiersz;
		wiersz = '<tr>';
		wiersz += '<td>' + (index + 1) + '</td>';
		wiersz += '<td>' + banki[index].Bank + '</td>';
		wiersz += '<td>' + banki[index].Oprocentowanie + '</td>';
		wiersz += '<td>' + banki[index].Marza + '</td>';
		wiersz += '</tr>';
		$('#Table80NK tr:last').after(wiersz);
	}
	
	banki = [];
	banki = JSON.parse(LTV80_SK_Banki_JSON);

	for (var index = 0; index < banki.length; index++)
	{		
		var wiersz;
		wiersz = '<tr>';
		wiersz += '<td>' + (index + 1) + '</td>';
		wiersz += '<td>' + banki[index].Bank + '</td>';
		wiersz += '<td>' + banki[index].Oprocentowanie + '</td>';
		wiersz += '<td>' + banki[index].Marza + '</td>';
		wiersz += '</tr>';
		$('#Table80SK tr:last').after(wiersz);
	}

}





