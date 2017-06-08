var LTV90_NK_Banki_JSON;
var LTV90_SK_Banki_JSON;
var LTV80_NK_Banki_JSON;
var LTV80_SK_Banki_JSON;


function Get_LTV90_NK_Banki_JSON() { return LTV90_NK_Banki_JSON; }
function Get_LTV90_SK_Banki_JSON() { return LTV90_SK_Banki_JSON; }
function Get_LTV80_NK_Banki_JSON() { return LTV80_NK_Banki_JSON; }
function Get_LTV80_SK_Banki_JSON() { return LTV80_SK_Banki_JSON; }

function BankierGetRankingFromApi() {
  var rateUrl = "http://localhost/api/bankierKH.php"; 
  var response;

  var currencyJson = $.ajax({
    url: rateUrl,
    context: document.body,
    async: false 
  }).done(function (x) {	
	response = x;
	var bigArray = [];
	bigArray = JSON.parse(response);
	LTV90_NK_Banki_JSON = JSON.stringify(bigArray[0].Dane);
	LTV90_SK_Banki_JSON = JSON.stringify(bigArray[1].Dane);
	LTV80_NK_Banki_JSON = JSON.stringify(bigArray[2].Dane);
	LTV80_SK_Banki_JSON = JSON.stringify(bigArray[3].Dane);
  });
  
  UstawTabele();
  
}



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





