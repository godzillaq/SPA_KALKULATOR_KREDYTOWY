var Identyfikator_uzytkownik = -1;
var Nazwa_uzytkownik = "";


function Zaloguj()
{
	var email = $("#lemail").val();
	var haslo = $("#lhaslo").val();	
	$.post("baza.php",{ operacja_: "logowanie", email_: email, haslo_:haslo},
	function(data) 
	{
		if (data < 0) alert("Niepoprawne dane!");
		else
		{
			var uz_dane = JSON.parse(data);
			Identyfikator_uzytkownik = uz_dane.Id;
			Nazwa_uzytkownik = uz_dane.Nazwa;
			$("#myModal").modal("hide");
			$("#btnLoginReje").hide();	
			$("#Uz_Nazwa").text("Witaj " + Nazwa_uzytkownik + " !");
			if ($('#lzapamietajdane').is(':checked'))
			{			
				ZapiszDoLS(email, haslo);
			}		
		}
	});
};		  


function Zarejestruj()
{
	
	var nazwa = $("#rnazwa").val();
	var email = $("#remail").val();
	var haslo = $("#rhaslo").val();
	
	if (nazwa == "" || email == "" || haslo == "")
	{
		alert("Trzeba by dorobić jakąś fajną walidację tego ;)");
		return;
	}	
	$.post("baza.php",{ operacja_: "rejestracja", nazwa_: nazwa, email_: email, haslo_:haslo},
	function(data) 
	{
		if (data < 0) alert("Adres email jest już zajęty!");
		else
		{
			var uz_dane = JSON.parse(data);
			Identyfikator_uzytkownik = uz_dane.Id;
			Nazwa_uzytkownik = uz_dane.Nazwa;
			$("#myModal").modal("hide");
			$("#btnLoginReje").hide();	
			$("#Uz_Nazwa").text("Witaj " + Nazwa_uzytkownik + " !");
			if ($('#rzapamietajdane').is(':checked'))
			{			
				ZapiszDoLS(email, haslo);
			}	
		}
	});
};


function ZapiszDoLS(email, haslo)
{
	localStorage.email = email; 
	localStorage.haslo = haslo;
}
function OdczytajZLS()
{
	$("#lemail").val(localStorage.email);
	$("#lhaslo").val(localStorage.haslo);
}

